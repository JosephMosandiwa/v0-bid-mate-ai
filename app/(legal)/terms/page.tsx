import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | BidMate AI",
  description: "Terms of Service for BidMate AI tender management platform",
}

export default function TermsPage() {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="font-heading">Terms of Service</h1>
      <p className="lead text-muted-foreground">Last updated: December 2024</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using BidMate AI ("the Service"), you agree to be bound by these Terms of Service. If you do not
        agree to these terms, please do not use the Service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        BidMate AI provides an AI-powered tender management platform designed for South African businesses. The Service
        includes tender discovery, document analysis, bid preparation assistance, and strategic recommendations.
      </p>

      <h2>3. User Accounts</h2>
      <p>To use certain features of the Service, you must create an account. You agree to:</p>
      <ul>
        <li>Provide accurate and complete information</li>
        <li>Maintain the security of your account credentials</li>
        <li>Notify us immediately of any unauthorized access</li>
        <li>Accept responsibility for all activities under your account</li>
      </ul>

      <h2>4. Subscription and Payments</h2>
      <p>
        Some features require a paid subscription. Payment terms are displayed at the time of purchase. Subscriptions
        automatically renew unless cancelled before the renewal date.
      </p>

      <h2>5. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for any unlawful purpose</li>
        <li>Submit false or misleading information in tender documents</li>
        <li>Attempt to reverse engineer or copy the Service</li>
        <li>Share your account with unauthorized users</li>
        <li>Use automated systems to access the Service without permission</li>
      </ul>

      <h2>6. AI-Generated Content Disclaimer</h2>
      <p>
        The Service uses artificial intelligence to generate recommendations, strategies, and document content. While we
        strive for accuracy, AI-generated content should be reviewed by qualified professionals before submission.
        BidMate AI is not responsible for errors in AI-generated content or bid outcomes.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        The Service, including its software, design, and content, is owned by BidMate AI and protected by intellectual
        property laws. Your content remains your property, but you grant us a license to process it for providing the
        Service.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, BidMate AI shall not be liable for any indirect, incidental, special, or
        consequential damages arising from your use of the Service, including lost profits or failed bid attempts.
      </p>

      <h2>9. Termination</h2>
      <p>
        We may suspend or terminate your access to the Service at any time for violation of these terms. You may cancel
        your account at any time through your account settings.
      </p>

      <h2>10. Governing Law</h2>
      <p>
        These terms are governed by the laws of the Republic of South Africa. Any disputes shall be resolved in the
        courts of South Africa.
      </p>

      <h2>11. Changes to Terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the Service after changes constitutes acceptance
        of the new terms.
      </p>

      <h2>12. Contact</h2>
      <p>
        For questions about these terms, contact us at <a href="mailto:legal@bidmate.ai">legal@bidmate.ai</a>.
      </p>
    </article>
  )
}
