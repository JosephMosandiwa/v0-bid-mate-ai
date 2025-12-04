import type { Metadata } from "next"
import { SiteHeader } from "@/components/marketing/site-header"
import { SiteFooter } from "@/components/marketing/site-footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText, MessageCircle, Video, BookOpen, LifeBuoy } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Support Center | BidMate AI",
  description: "Get help with BidMate AI - FAQs, guides, tutorials, and contact support",
}

const FAQ_CATEGORIES = [
  {
    title: "Getting Started",
    faqs: [
      {
        question: "How do I create an account?",
        answer:
          "Click 'Get Started Free' on our homepage and fill in your email and password. You'll receive a confirmation email to verify your account. After verification, complete the onboarding wizard to set up your company profile.",
      },
      {
        question: "Is BidMate AI free to use?",
        answer:
          "We offer a free tier with limited features including basic tender search and document storage. Premium plans unlock AI analysis, unlimited tender tracking, and strategic recommendations. View our pricing page for details.",
      },
      {
        question: "What documents do I need to get started?",
        answer:
          "To get the most from BidMate AI, have your company registration documents, B-BBEE certificate, tax clearance certificate, and CIDB registration (for construction) ready. These help us match you with relevant tenders.",
      },
    ],
  },
  {
    title: "Tender Search",
    faqs: [
      {
        question: "How does the tender matching work?",
        answer:
          "Our AI analyzes your company profile, industry sectors, B-BBEE level, CIDB grading, and past bid history to recommend the most relevant tenders. The more complete your profile, the better the matches.",
      },
      {
        question: "How often is the tender database updated?",
        answer:
          "We scrape major South African tender portals daily, including eTenders, provincial government sites, SOE procurement pages, and private sector opportunities. New tenders are typically available within 24 hours of publication.",
      },
      {
        question: "Can I save tenders for later?",
        answer:
          "Yes! Click the bookmark icon on any tender to save it to your watchlist. You'll receive deadline reminders and can track your progress through the bid preparation stages.",
      },
    ],
  },
  {
    title: "AI Features",
    faqs: [
      {
        question: "How accurate is the AI tender analysis?",
        answer:
          "Our AI provides strategic guidance based on tender documents and your company profile. While we strive for accuracy, AI recommendations should be reviewed by qualified professionals. We recommend using AI insights as a starting point, not final decisions.",
      },
      {
        question: "Can the AI fill in tender documents for me?",
        answer:
          "Yes, our DocuMind engine can auto-populate standard tender forms (SBD1, SBD4, MBD1, etc.) using your saved company data. Always review auto-filled documents before submission.",
      },
      {
        question: "What is the AI Strategist?",
        answer:
          "The AI Strategist is your personal tendering advisor. It answers questions about tender requirements, suggests pricing strategies, identifies compliance gaps, and provides bid/no-bid recommendations based on your win probability.",
      },
    ],
  },
  {
    title: "Account & Billing",
    faqs: [
      {
        question: "How do I upgrade my subscription?",
        answer:
          "Go to Dashboard > Settings > Subscription and select your preferred plan. Payment is processed securely through Stripe. Upgrades take effect immediately.",
      },
      {
        question: "Can I cancel my subscription?",
        answer:
          "Yes, you can cancel anytime from your account settings. Your access continues until the end of the current billing period. We don't offer refunds for partial months.",
      },
      {
        question: "Is my data secure?",
        answer:
          "Absolutely. We use industry-standard encryption, secure data centers, and comply with POPIA requirements. Your tender documents and company data are never shared with third parties.",
      },
    ],
  },
]

const RESOURCES = [
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Detailed guides for all features",
    href: "/docs",
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step walkthroughs",
    href: "/tutorials",
  },
  {
    icon: FileText,
    title: "Blog & Updates",
    description: "Tips and product news",
    href: "/blog",
  },
  {
    icon: MessageCircle,
    title: "Community Forum",
    description: "Connect with other users",
    href: "/community",
  },
]

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <LifeBuoy className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">How can we help?</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Search our knowledge base or browse frequently asked questions
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search for help articles..." className="pl-12 h-12 rounded-xl text-base" />
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {RESOURCES.map((resource) => (
                <Link key={resource.title} href={resource.href}>
                  <Card className="rounded-xl hover:border-primary/50 transition-colors h-full">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <resource.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

            <div className="space-y-8">
              {FAQ_CATEGORIES.map((category) => (
                <Card key={category.title} className="rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Accordion type="single" collapsible className="w-full">
                      {category.faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`${category.title}-${index}`}>
                          <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact CTA */}
            <Card className="rounded-xl mt-12 bg-primary/5 border-primary/20">
              <CardContent className="p-8 text-center">
                <h3 className="font-heading text-xl font-semibold mb-2">Still need help?</h3>
                <p className="text-muted-foreground mb-6">Our support team is ready to assist you with any questions</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/strategist">Ask AI Strategist</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
