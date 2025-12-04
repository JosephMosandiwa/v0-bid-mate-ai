import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  Upload,
  Brain,
  CheckCircle,
  ArrowRight,
  Quote,
} from "lucide-react"
import { SiteHeader } from "@/components/marketing/site-header"
import { SiteFooter } from "@/components/marketing/site-footer"
import { PricingPlans } from "@/components/pricing-plans"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Tender Assistance
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance leading-tight font-heading">
              Win More Tenders with AI Intelligence
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed max-w-lg">
              Streamline your tender process with intelligent document analysis, automated form filling, and real-time
              tender discovery from South African government databases.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="rounded-xl text-base">
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-xl text-base bg-transparent">
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>

          {/* Right: Device Mockup */}
          <div className="relative hidden lg:block">
            <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 border border-border">
              <div className="bg-card rounded-xl shadow-2xl overflow-hidden border border-border">
                <div className="bg-muted/50 px-4 py-3 flex items-center gap-2 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">BidMate Dashboard</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-foreground">Tender Analysis</div>
                      <div className="text-xs text-muted-foreground">AI scanning document...</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-primary rounded-full" />
                    </div>
                    <p className="text-xs text-muted-foreground">Extracting requirements...</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Deadline</p>
                      <p className="text-sm font-medium text-foreground">Dec 15, 2025</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Match Score</p>
                      <p className="text-sm font-medium text-primary">92%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Tenders Analyzed" },
              { value: "95%", label: "Success Rate" },
              { value: "500+", label: "Active Users" },
              { value: "24/7", label: "AI Support" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2 font-heading">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your tender process
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              icon: Upload,
              title: "Upload Tender",
              description: "Drag and drop your tender documents. We support PDF, Word, and Excel files.",
            },
            {
              step: "02",
              icon: Brain,
              title: "AI Analyzes",
              description:
                "Our AI extracts requirements, deadlines, evaluation criteria, and generates a compliance checklist.",
            },
            {
              step: "03",
              icon: CheckCircle,
              title: "Auto-fill & BOQ",
              description:
                "Automatically populate forms with your company data and get AI-powered BOQ pricing suggestions.",
            },
          ].map((item) => (
            <div key={item.step} className="relative">
              <div className="text-6xl font-bold text-primary/10 absolute -top-4 -left-2 font-heading">{item.step}</div>
              <Card className="border-border rounded-xl pt-8 h-full">
                <CardHeader>
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="font-heading">{item.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-card/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">
              Everything You Need to Win Tenders
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform handles the complexity so you can focus on what matters
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Document Analysis",
                description:
                  "AI analyzes tender documents to extract key requirements, deadlines, and evaluation criteria",
                color: "primary",
              },
              {
                icon: Zap,
                title: "Smart Form Filling",
                description: "Automatically populate tender forms with your company information and tailored responses",
                color: "accent",
              },
              {
                icon: Search,
                title: "Tender Discovery",
                description: "Search and discover relevant government tenders from the eTenders database in real-time",
                color: "primary",
              },
              {
                icon: TrendingUp,
                title: "Compliance Checking",
                description: "Ensure your submissions meet all requirements before submission with AI validation",
                color: "accent",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Work together on tender submissions with your team in a centralized workspace",
                color: "primary",
              },
              {
                icon: Sparkles,
                title: "AI Strategist",
                description:
                  "Get instant answers about tender requirements and personalized bid strategies from our AI agent",
                color: "accent",
              },
            ].map((feature) => (
              <Card key={feature.title} className="border-border rounded-xl hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`h-12 w-12 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 text-${feature.color}`} />
                  </div>
                  <CardTitle className="font-heading">{feature.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of businesses winning more tenders
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              quote:
                "BidMate has transformed how we approach government tenders. The AI analysis saves us hours of work.",
              author: "Sarah M.",
              role: "Procurement Manager",
              company: "Construction Co.",
            },
            {
              quote: "The auto-fill feature alone is worth the subscription. No more manual data entry errors.",
              author: "John D.",
              role: "Business Owner",
              company: "IT Services Ltd.",
            },
            {
              quote: "We've increased our tender win rate by 40% since using BidMate. Highly recommended.",
              author: "Thabo N.",
              role: "CEO",
              company: "Facilities Group",
            },
          ].map((testimonial) => (
            <Card key={testimonial.author} className="border-border rounded-xl">
              <CardHeader>
                <Quote className="h-8 w-8 text-primary/30 mb-2" />
                <CardDescription className="text-base leading-relaxed text-foreground/80 mb-4">
                  "{testimonial.quote}"
                </CardDescription>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-card/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">Choose Your Plan</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Flexible pricing for businesses of all sizes
            </p>
          </div>
          <PricingPlans />
          <div className="mt-8 text-center">
            <Link href="/pricing" className="text-primary hover:underline text-sm font-medium">
              View detailed pricing comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-12 border border-border">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">
            Ready to Transform Your Tender Process?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join hundreds of businesses winning more tenders with AI assistance
          </p>
          <Button size="lg" asChild className="rounded-xl">
            <Link href="/signup">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
