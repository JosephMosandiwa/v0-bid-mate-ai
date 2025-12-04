import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | BidMate AI",
  description: "Privacy Policy for BidMate AI tender management platform",
}

export default function PrivacyPage() {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="font-heading">Privacy Policy</h1>
      <p className="lead text-muted-foreground">Last updated: December 2024</p>

      <h2>1. Information We Collect</h2>
      <h3>Account Information</h3>
      <p>When you create an account, we collect:</p>
      <ul>
        <li>Name and email address</li>
        <li>Company name and registration details</li>
        <li>Contact phone number</li>
        <li>Province and location information</li>
      </ul>

      <h3>Business Information</h3>
      <p>To provide personalized recommendations, we collect:</p>
      <ul>
        <li>Industry sectors and CIDB grading</li>
        <li>B-BBEE certification level</li>
        <li>Compliance document status</li>
        <li>Tender preferences and history</li>
      </ul>

      <h3>Usage Data</h3>
      <p>We automatically collect:</p>
      <ul>
        <li>Pages visited and features used</li>
        <li>Search queries and tender interactions</li>
        <li>Device and browser information</li>
        <li>IP address and location data</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Provide and improve the Service</li>
        <li>Match you with relevant tenders</li>
        <li>Generate AI-powered recommendations</li>
        <li>Send notifications and alerts</li>
        <li>Process payments</li>
        <li>Respond to support requests</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>3. AI Processing</h2>
      <p>
        Our AI systems process your documents and data to provide analysis and recommendations. This processing is
        essential to the Service. Your data may be used to improve our AI models in an anonymized, aggregated form.
      </p>

      <h2>4. Data Sharing</h2>
      <p>We do not sell your personal information. We may share data with:</p>
      <ul>
        <li>Service providers who assist in operating the platform</li>
        <li>Payment processors for subscription management</li>
        <li>Law enforcement when required by law</li>
      </ul>

      <h2>5. Data Security</h2>
      <p>
        We implement industry-standard security measures including encryption, access controls, and regular security
        audits. However, no system is completely secure, and we cannot guarantee absolute security.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain your data for as long as your account is active or as needed to provide services. You may request
        deletion of your data at any time, subject to legal retention requirements.
      </p>

      <h2>7. Your Rights (POPIA)</h2>
      <p>Under the Protection of Personal Information Act (POPIA), you have the right to:</p>
      <ul>
        <li>Access your personal information</li>
        <li>Correct inaccurate information</li>
        <li>Request deletion of your data</li>
        <li>Object to processing of your data</li>
        <li>Data portability</li>
        <li>Lodge a complaint with the Information Regulator</li>
      </ul>

      <h2>8. Cookies</h2>
      <p>
        We use cookies and similar technologies to improve your experience. See our <a href="/cookies">Cookie Policy</a>{" "}
        for details.
      </p>

      <h2>9. Children's Privacy</h2>
      <p>
        The Service is not intended for users under 18 years of age. We do not knowingly collect information from
        children.
      </p>

      <h2>10. International Transfers</h2>
      <p>
        Your data may be processed in countries outside South Africa. We ensure appropriate safeguards are in place for
        such transfers.
      </p>

      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this policy periodically. We will notify you of significant changes via email or through the
        Service.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        For privacy-related inquiries, contact our Information Officer at{" "}
        <a href="mailto:privacy@bidmate.ai">privacy@bidmate.ai</a>.
      </p>
    </article>
  )
}
