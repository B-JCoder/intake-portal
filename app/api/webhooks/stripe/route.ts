import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = (await headers()).get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { projectId, paymentType } = session.metadata!

        // Update payment status
        await prisma.payment.updateMany({
          where: {
            stripeSessionId: session.id,
          },
          data: {
            status: "PAID",
            paymentIntentId: session.payment_intent as string,
          },
        })

        // Update project status
        await prisma.projectForm.update({
          where: { id: projectId },
          data: { status: "IN_PROGRESS" },
        })

        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object

        await prisma.payment.updateMany({
          where: {
            paymentIntentId: failedPayment.id,
          },
          data: {
            status: "FAILED",
          },
        })

        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
