import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - IKODIO",
  description: "IKODIO Privacy Policy - How we collect, use, and protect your data",
};

export default function PrivacyPolicyPage() {
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
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-zinc-400">
              Last Updated: November 4, 2025
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Introduction</h2>
              <p className="text-zinc-300 leading-relaxed">
                Welcome to IKODIO ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered stock prediction platform.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                By using IKODIO, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.1 Personal Information</h3>
              <p className="text-zinc-300 leading-relaxed">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Name and contact information (email address, phone number)</li>
                <li>Account credentials (username, password)</li>
                <li>KYC (Know Your Customer) information as required by Indonesian regulations</li>
                <li>Payment and billing information</li>
                <li>Profile information and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.2 Trading and Investment Information</h3>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Stock watchlists and portfolios</li>
                <li>Trading preferences and strategies</li>
                <li>Transaction history and order data</li>
                <li>Risk tolerance and investment goals</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.3 Usage and Technical Data</h3>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage patterns and interactions with our platform</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Log data and analytics information</li>
                <li>API requests and system performance metrics</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. How We Use Your Information</h2>
              <p className="text-zinc-300 leading-relaxed">We use the collected information for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>To provide and maintain our stock prediction services</li>
                <li>To personalize your experience and provide customized recommendations</li>
                <li>To process transactions and manage your account</li>
                <li>To send you notifications, updates, and marketing communications</li>
                <li>To improve our AI algorithms and prediction accuracy</li>
                <li>To detect, prevent, and address technical issues and security threats</li>
                <li>To comply with legal obligations and regulatory requirements</li>
                <li>To analyze usage patterns and conduct research and development</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Data Sharing and Disclosure</h2>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.1 Third-Party Service Providers</h3>
              <p className="text-zinc-300 leading-relaxed">
                We may share your information with trusted third-party service providers who assist us in operating our platform, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Cloud hosting and infrastructure providers (Vercel, AWS)</li>
                <li>Payment processors and financial service providers</li>
                <li>AI and machine learning service providers (Google Gemini AI)</li>
                <li>Analytics and monitoring services</li>
                <li>Email and communication service providers</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.2 Legal Requirements</h3>
              <p className="text-zinc-300 leading-relaxed">
                We may disclose your information if required by law, regulation, or legal process, or to protect the rights, property, or safety of IKODIO, our users, or others.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.3 Business Transfers</h3>
              <p className="text-zinc-300 leading-relaxed">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Data Security</h2>
              <p className="text-zinc-300 leading-relaxed">
                We implement industry-standard security measures to protect your information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Encryption of data in transit and at rest (TLS/SSL)</li>
                <li>Secure authentication and access controls</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Employee training on data protection and security best practices</li>
                <li>Monitoring and logging of system access</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed mt-4">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Your Rights and Choices</h2>
              <p className="text-zinc-300 leading-relaxed">You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a structured format</li>
                <li><strong>Objection:</strong> Object to the processing of your information</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for processing where applicable</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed mt-4">
                To exercise these rights, please contact us at <a href="mailto:info@ikodio.com" className="text-blue-400 hover:text-blue-300">info@ikodio.com</a>.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-zinc-300 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookie settings through your browser preferences.
              </p>
              <p className="text-zinc-300 leading-relaxed mt-4">Types of cookies we use:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements and promotions</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Data Retention</h2>
              <p className="text-zinc-300 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. When information is no longer needed, we will securely delete or anonymize it.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">9. International Data Transfers</h2>
              <p className="text-zinc-300 leading-relaxed">
                Your information may be transferred to and processed in countries other than Indonesia. We ensure that appropriate safeguards are in place to protect your information in accordance with this Privacy Policy and applicable data protection laws.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">10. Children's Privacy</h2>
              <p className="text-zinc-300 leading-relaxed">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete such information.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-zinc-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. Your continued use of our services after changes are posted constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">12. Contact Us</h2>
              <p className="text-zinc-300 leading-relaxed">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 mt-4">
                <p className="text-white font-semibold mb-2">IKODIO</p>
                <p className="text-zinc-300">Email: <a href="mailto:info@ikodio.com" className="text-blue-400 hover:text-blue-300">info@ikodio.com</a></p>
                <p className="text-zinc-300">Phone: <a href="tel:+6281112852 32" className="text-blue-400 hover:text-blue-300">+62 811-1285-232</a></p>
              </div>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">13. Compliance with Indonesian Regulations</h2>
              <p className="text-zinc-300 leading-relaxed">
                IKODIO complies with Indonesian data protection laws and regulations, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Law No. 27 of 2022 on Personal Data Protection (UU PDP)</li>
                <li>Financial Services Authority (OJK) regulations</li>
                <li>Bank Indonesia regulations on electronic systems</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed mt-4">
                We are committed to maintaining the highest standards of data protection and privacy for our Indonesian users.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
