import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions - IKODIO",
  description: "IKODIO Terms and Conditions - Legal terms for using our platform",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Terms and Conditions</h1>
            <p className="text-zinc-400">
              Last Updated: November 4, 2025
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-zinc-300 leading-relaxed">
                Welcome to IKODIO. By accessing or using our AI-powered stock prediction platform ("Platform"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use our Platform.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                These Terms constitute a legally binding agreement between you ("User," "you," or "your") and IKODIO ("we," "us," or "our"). We reserve the right to modify these Terms at any time, and your continued use of the Platform constitutes acceptance of any changes.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Description of Services</h2>
              <p className="text-zinc-300 leading-relaxed">
                IKODIO provides an AI-powered stock prediction platform that offers:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Real-time stock price predictions using LSTM neural networks</li>
                <li>Technical analysis with 14+ indicators (RSI, MACD, Bollinger Bands, etc.)</li>
                <li>AI-powered sentiment analysis using Google Gemini AI</li>
                <li>Multi-timeframe predictions (1-minute to 1-hour)</li>
                <li>Confidence scoring and risk assessment</li>
                <li>Portfolio tracking and watchlist management</li>
                <li>Market analytics and insights for Indonesian stocks (IDX)</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. User Eligibility and Account Registration</h2>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.1 Eligibility</h3>
              <p className="text-zinc-300 leading-relaxed">
                To use IKODIO, you must:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Be at least 18 years of age</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>Not be prohibited from using our services under Indonesian law</li>
                <li>Provide accurate and complete registration information</li>
                <li>Complete KYC (Know Your Customer) verification as required by Indonesian regulations</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.2 Account Security</h3>
              <p className="text-zinc-300 leading-relaxed">You are responsible for:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
                <li>Using strong passwords and enabling two-factor authentication</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Investment Disclaimer and Risk Warning</h2>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 my-6">
                <h3 className="text-xl font-semibold text-red-400 mb-3">⚠️ IMPORTANT INVESTMENT DISCLAIMER</h3>
                <p className="text-zinc-200 leading-relaxed mb-3">
                  <strong>IKODIO provides predictions and analysis tools for informational purposes only. We DO NOT provide financial advice, investment recommendations, or trading signals.</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 text-zinc-200 ml-4">
                  <li>All predictions are based on AI algorithms and historical data, which may not accurately predict future market movements</li>
                  <li>Stock trading involves substantial risk of loss and is not suitable for all investors</li>
                  <li>Past performance does not guarantee future results</li>
                  <li>You may lose some or all of your invested capital</li>
                  <li>You are solely responsible for all investment decisions</li>
                  <li>We are not registered as investment advisors with OJK or any regulatory body</li>
                  <li>Always conduct your own research and consult with licensed financial advisors before making investment decisions</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.1 No Guarantee of Accuracy</h3>
              <p className="text-zinc-300 leading-relaxed">
                While we strive to provide accurate predictions using advanced AI technology, we make no warranties or guarantees regarding:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>The accuracy, reliability, or completeness of predictions</li>
                <li>The timeliness of data and information provided</li>
                <li>The profitability of any trading strategy based on our predictions</li>
                <li>The suitability of our platform for your specific investment goals</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Subscription and Payment Terms</h2>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">5.1 Pricing</h3>
              <p className="text-zinc-300 leading-relaxed">
                IKODIO offers various subscription tiers with different features and pricing. Current pricing is displayed on our website and may be changed with 30 days' notice.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">5.2 Payment</h3>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Subscriptions are billed monthly or annually in advance</li>
                <li>Payment is processed through secure third-party payment processors</li>
                <li>You authorize us to charge your payment method for all fees owed</li>
                <li>All fees are non-refundable except as required by law</li>
                <li>Failure to pay may result in suspension or termination of your account</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">5.3 Cancellation and Refunds</h3>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>You may cancel your subscription at any time through your account settings</li>
                <li>Cancellation takes effect at the end of the current billing period</li>
                <li>No refunds are provided for partial months or unused services</li>
                <li>You retain access to paid features until the end of your billing period</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Acceptable Use Policy</h2>
              <p className="text-zinc-300 leading-relaxed">You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Use the Platform for any illegal or unauthorized purpose</li>
                <li>Violate any laws, regulations, or third-party rights</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Reverse engineer, decompile, or disassemble our software or algorithms</li>
                <li>Use automated systems (bots, scrapers) to access the Platform without permission</li>
                <li>Resell, redistribute, or sublicense our services</li>
                <li>Manipulate or interfere with the proper functioning of the Platform</li>
                <li>Upload malicious code, viruses, or harmful content</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Impersonate any person or entity</li>
                <li>Use the Platform to manipulate stock prices or engage in market manipulation</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Intellectual Property Rights</h2>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">7.1 Our Intellectual Property</h3>
              <p className="text-zinc-300 leading-relaxed">
                All content, features, and functionality of the Platform, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>AI algorithms and prediction models</li>
                <li>Software, code, and technical architecture</li>
                <li>Trademarks, logos, and branding</li>
                <li>Text, graphics, and visual design</li>
                <li>Data compilations and analytics</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed mt-4">
                are owned by IKODIO and are protected by Indonesian and international intellectual property laws. You may not copy, modify, distribute, or create derivative works without our express written permission.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">7.2 User Content</h3>
              <p className="text-zinc-300 leading-relaxed">
                You retain ownership of any content you submit to the Platform (watchlists, notes, etc.). By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content as necessary to operate the Platform.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Data Privacy and Security</h2>
              <p className="text-zinc-300 leading-relaxed">
                We are committed to protecting your privacy and personal data in accordance with our <Link href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</Link> and Indonesian data protection laws (UU PDP No. 27 of 2022).
              </p>
              <p className="text-zinc-300 leading-relaxed mt-4">
                We implement industry-standard security measures, but cannot guarantee absolute security. You acknowledge that internet transmission is never completely secure and use our Platform at your own risk.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">9. Limitation of Liability</h2>
              <p className="text-zinc-300 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>IKODIO is provided "AS IS" and "AS AVAILABLE" without warranties of any kind</li>
                <li>We disclaim all warranties, express or implied, including merchantability and fitness for a particular purpose</li>
                <li>We are not liable for any direct, indirect, incidental, consequential, or punitive damages</li>
                <li>We are not responsible for investment losses, trading losses, or missed opportunities</li>
                <li>Our total liability shall not exceed the amount you paid us in the 12 months prior to the claim</li>
                <li>We are not liable for service interruptions, data loss, or technical failures</li>
                <li>We are not responsible for third-party content, services, or actions</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">10. Indemnification</h2>
              <p className="text-zinc-300 leading-relaxed">
                You agree to indemnify, defend, and hold harmless IKODIO, its affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, losses, costs, or expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Your use of the Platform</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any laws or third-party rights</li>
                <li>Your investment decisions based on our predictions</li>
                <li>Any content you submit to the Platform</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">11. Termination</h2>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">11.1 Termination by You</h3>
              <p className="text-zinc-300 leading-relaxed">
                You may terminate your account at any time by contacting us or using the account cancellation feature.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">11.2 Termination by Us</h3>
              <p className="text-zinc-300 leading-relaxed">
                We may suspend or terminate your account immediately, without notice, if you:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Violate these Terms or our policies</li>
                <li>Engage in fraudulent or illegal activities</li>
                <li>Fail to pay subscription fees</li>
                <li>Pose a security risk to our Platform or other users</li>
                <li>Provide false or misleading information</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">11.3 Effect of Termination</h3>
              <p className="text-zinc-300 leading-relaxed">
                Upon termination, your right to access the Platform immediately ceases. We may delete your account data, but are not obligated to do so. Provisions that by their nature should survive termination (including liability limitations, indemnification, and dispute resolution) will remain in effect.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">12. Third-Party Services and Links</h2>
              <p className="text-zinc-300 leading-relaxed">
                Our Platform may contain links to third-party websites, services, or content. We do not endorse, control, or assume responsibility for any third-party services. Your use of third-party services is at your own risk and subject to their terms and conditions.
              </p>
              <p className="text-zinc-300 leading-relaxed mt-4">
                We integrate with third-party services including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Google Gemini AI for sentiment analysis</li>
                <li>Financial data providers for market data</li>
                <li>Payment processors for billing</li>
                <li>Analytics and monitoring services</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">13. Governing Law and Dispute Resolution</h2>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">13.1 Governing Law</h3>
              <p className="text-zinc-300 leading-relaxed">
                These Terms are governed by and construed in accordance with the laws of the Republic of Indonesia, without regard to conflict of law principles.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">13.2 Dispute Resolution</h3>
              <p className="text-zinc-300 leading-relaxed">
                Any disputes arising from these Terms or your use of the Platform shall be resolved through:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-zinc-300 ml-4">
                <li>Good faith negotiations between the parties</li>
                <li>Mediation if negotiations fail</li>
                <li>Arbitration in accordance with Indonesian arbitration laws</li>
                <li>The courts of Jakarta, Indonesia, as a last resort</li>
              </ol>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">14. Regulatory Compliance</h2>
              <p className="text-zinc-300 leading-relaxed">
                IKODIO operates in compliance with Indonesian laws and regulations, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Financial Services Authority (OJK) regulations</li>
                <li>Indonesia Stock Exchange (IDX) rules</li>
                <li>Bank Indonesia payment system regulations</li>
                <li>Personal Data Protection Law (UU PDP No. 27 of 2022)</li>
                <li>Electronic Information and Transactions Law (UU ITE)</li>
                <li>Anti-Money Laundering (AML) and Counter-Terrorism Financing (CTF) regulations</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed mt-4">
                Users must comply with all applicable laws and regulations when using our Platform.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">15. Changes to Terms</h2>
              <p className="text-zinc-300 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify you of material changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Posting the updated Terms on our website</li>
                <li>Updating the "Last Updated" date</li>
                <li>Sending email notifications for significant changes</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed mt-4">
                Your continued use of the Platform after changes are posted constitutes acceptance of the modified Terms. If you do not agree to the changes, you must stop using the Platform and cancel your account.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">16. Miscellaneous Provisions</h2>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">16.1 Severability</h3>
              <p className="text-zinc-300 leading-relaxed">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">16.2 Entire Agreement</h3>
              <p className="text-zinc-300 leading-relaxed">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and IKODIO regarding your use of the Platform.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">16.3 Waiver</h3>
              <p className="text-zinc-300 leading-relaxed">
                Our failure to enforce any right or provision of these Terms does not constitute a waiver of such right or provision.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">16.4 Assignment</h3>
              <p className="text-zinc-300 leading-relaxed">
                You may not assign or transfer these Terms or your account without our written consent. We may assign our rights and obligations without restriction.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">16.5 Force Majeure</h3>
              <p className="text-zinc-300 leading-relaxed">
                We are not liable for delays or failures in performance resulting from circumstances beyond our reasonable control, including natural disasters, war, terrorism, pandemics, internet outages, or government actions.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">17. Contact Information</h2>
              <p className="text-zinc-300 leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 mt-4">
                <p className="text-white font-semibold mb-2">IKODIO</p>
                <p className="text-zinc-300">Email: <a href="mailto:info@ikodio.com" className="text-blue-400 hover:text-blue-300">info@ikodio.com</a></p>
                <p className="text-zinc-300">Phone: <a href="tel:+6281112852 32" className="text-blue-400 hover:text-blue-300">+62 811-1285-232</a></p>
                <p className="text-zinc-300 mt-4">
                  For legal inquiries: <a href="mailto:legal@ikodio.com" className="text-blue-400 hover:text-blue-300">legal@ikodio.com</a>
                </p>
              </div>
            </section>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mt-8">
              <p className="text-zinc-200 leading-relaxed">
                <strong>By using IKODIO, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
