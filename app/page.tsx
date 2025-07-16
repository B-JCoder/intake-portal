import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Star, Users, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"

export default async function LandingPage() {
  const { userId } = await auth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-900">SaaS Intake</div>
        <div className="space-x-4">
          {userId ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/submit">
                <Button>New Project</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Streamline Your Client Intake Process</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Professional project intake forms, automated payments, and client management all in one powerful platform.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href={userId ? "/submit" : "/sign-up"}>
            <Button size="lg" className="text-lg px-8 py-4">
              Start Your Project Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          {userId && (
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-transparent">
                View Dashboard
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Zap className="h-10 w-10 text-blue-600 mb-4 mx-auto" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>Get your project started in minutes with our streamlined intake process</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-10 w-10 text-green-600 mb-4 mx-auto" />
              <CardTitle>Expert Team</CardTitle>
              <CardDescription>Work with experienced professionals who understand your business needs</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <CheckCircle className="h-10 w-10 text-purple-600 mb-4 mx-auto" />
              <CardTitle>Guaranteed Results</CardTitle>
              <CardDescription>We deliver high-quality results on time, every time</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  The intake process was so smooth and professional. They delivered exactly what we needed.
                </p>
                <p className="font-semibold">- Sarah Johnson, CEO</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  Outstanding service and communication throughout the entire project.
                </p>
                <p className="font-semibold">- Mike Chen, Founder</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center text-gray-600">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <p>hello@saasintake.com</p>
            <p>(555) 123-4567</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <p>Terms & Conditions</p>
            <p>Privacy Policy</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <p>Help Center</p>
            <p>Documentation</p>
          </div>
        </div>
        <p>&copy; 2024 SaaS Intake Platform. All rights reserved.</p>
      </footer>
    </div>
  )
}
