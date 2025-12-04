import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy | BidMate AI",
  description: "Cookie Policy for BidMate AI tender management platform",
}

export default function CookiesPage() {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="font-heading">Cookie Policy</h1>
      <p className="lead text-muted-foreground">Last updated: December 2024</p>

      <h2>What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit websites. They help websites remember your
        preferences and improve your experience.
      </p>

      <h2>How We Use Cookies</h2>

      <h3>Essential Cookies</h3>
      <p>Required for the Service to function. These cannot be disabled.</p>
      <ul>
        <li>
          <strong>Authentication:</strong> Keep you logged in securely
        </li>
        <li>
          <strong>Security:</strong> Protect against fraudulent activity
        </li>
        <li>
          <strong>Session:</strong> Remember your preferences during a visit
        </li>
      </ul>

      <h3>Analytics Cookies</h3>
      <p>Help us understand how visitors use the Service.</p>
      <ul>
        <li>
          <strong>Usage patterns:</strong> Pages visited, time spent, navigation paths
        </li>
        <li>
          <strong>Performance:</strong> Page load times, errors encountered
        </li>
      </ul>

      <h3>Functional Cookies</h3>
      <p>Enable enhanced features and personalization.</p>
      <ul>
        <li>
          <strong>Preferences:</strong> Language, theme, display settings
        </li>
        <li>
          <strong>Recent items:</strong> Previously viewed tenders
        </li>
      </ul>

      <h3>Marketing Cookies</h3>
      <p>Used to deliver relevant advertisements (if enabled).</p>
      <ul>
        <li>
          <strong>Ad targeting:</strong> Show relevant promotional content
        </li>
        <li>
          <strong>Conversion tracking:</strong> Measure campaign effectiveness
        </li>
      </ul>

      <h2>Third-Party Cookies</h2>
      <p>Some cookies are set by third-party services we use:</p>
      <ul>
        <li>
          <strong>Vercel Analytics:</strong> Website performance monitoring
        </li>
        <li>
          <strong>Stripe:</strong> Payment processing
        </li>
        <li>
          <strong>Supabase:</strong> Authentication services
        </li>
      </ul>

      <h2>Managing Cookies</h2>
      <p>You can control cookies through:</p>
      <ul>
        <li>
          <strong>Cookie banner:</strong> Accept or customize when you first visit
        </li>
        <li>
          <strong>Browser settings:</strong> Block or delete cookies in your browser
        </li>
        <li>
          <strong>Account settings:</strong> Manage preferences in your profile
        </li>
      </ul>

      <h2>Cookie Duration</h2>
      <ul>
        <li>
          <strong>Session cookies:</strong> Deleted when you close your browser
        </li>
        <li>
          <strong>Persistent cookies:</strong> Remain for a set period (typically 1 year)
        </li>
      </ul>

      <h2>Contact</h2>
      <p>
        Questions about our cookie practices? Contact us at <a href="mailto:privacy@bidmate.ai">privacy@bidmate.ai</a>.
      </p>
    </article>
  )
}
