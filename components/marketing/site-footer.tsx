import Link from "next/link"
import { FileText } from "lucide-react"

const footerLinks = {
  company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/support", label: "Support" },
  ],
  legal: [
    { href: "/legal/terms", label: "Terms of Use" },
    { href: "/legal/privacy", label: "Privacy Policy" },
    { href: "/legal/cookies", label: "Cookie Policy" },
  ],
  product: [
    { href: "/#features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#how-it-works", label: "How It Works" },
  ],
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground font-heading">BidMate</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered tender management platform for South African businesses.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 font-heading">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 font-heading">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 font-heading">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} BidMate — All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/legal/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link
              href="/legal/privacy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/legal/cookies"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
