import type { Metadata } from "next"
import { SiteHeader } from "@/components/marketing/site-header"
import { SiteFooter } from "@/components/marketing/site-footer"
import { ContactForm } from "./contact-form"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Contact Us | BidMate AI",
  description: "Get in touch with the BidMate AI team for support, partnerships, or general inquiries",
}

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    detail: "support@bidmate.ai",
    link: "mailto:support@bidmate.ai",
  },
  {
    icon: Phone,
    title: "Phone",
    detail: "+27 12 345 6789",
    link: "tel:+27123456789",
  },
  {
    icon: MapPin,
    title: "Address",
    detail: "Sandton, Gauteng, South Africa",
    link: null,
  },
  {
    icon: Clock,
    title: "Business Hours",
    detail: "Mon - Fri: 8:00 - 17:00 SAST",
    link: null,
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about BidMate AI? We're here to help you succeed in your tendering journey.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div>
                <h2 className="font-heading text-2xl font-semibold mb-6">Send us a Message</h2>
                <ContactForm />
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="font-heading text-2xl font-semibold mb-6">Contact Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {contactInfo.map((item) => (
                    <Card key={item.title} className="rounded-xl">
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">{item.title}</h3>
                          {item.link ? (
                            <a href={item.link} className="text-foreground hover:text-primary transition-colors">
                              {item.detail}
                            </a>
                          ) : (
                            <p className="text-foreground">{item.detail}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* FAQ Link */}
                <div className="mt-8 p-6 rounded-xl bg-muted/50 border">
                  <h3 className="font-heading text-lg font-semibold mb-2">Looking for quick answers?</h3>
                  <p className="text-muted-foreground mb-4">
                    Check our frequently asked questions for instant help with common queries.
                  </p>
                  <a href="/support" className="text-primary font-medium hover:underline">
                    Visit Support Center →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
