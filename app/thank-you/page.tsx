import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Home } from "lucide-react"
import Link from "next/link"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="text-center shadow-lg">
          <CardHeader>
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription className="text-base">
              Your project payment has been processed successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Transaction ID</p>
              <p className="font-mono font-bold text-lg">#TXN-2024-001</p>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Payment processed successfully
              </p>
              <p className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Project status updated
              </p>
              <p className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Team notified to begin work
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-1">What's Next?</p>
              <p className="text-sm text-blue-700">
                Our team will begin working on your project immediately. You'll receive regular updates via email and
                can track progress in your dashboard.
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/dashboard">
                <Button className="w-full">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
