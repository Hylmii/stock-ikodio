import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Send, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us - IKODIO",
  description: "Get in touch with IKODIO - We're here to help with your questions",
};

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Have questions about IKODIO? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">
                Contact Information
              </h2>
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <a
                      href="mailto:info@ikodio.com"
                      className="text-zinc-400 hover:text-blue-400 transition-colors"
                    >
                      info@ikodio.com
                    </a>
                    <p className="text-sm text-zinc-500 mt-1">
                      For general inquiries and support
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Phone</h3>
                    <a
                      href="tel:+6281112852 32"
                      className="text-zinc-400 hover:text-green-400 transition-colors"
                    >
                      +62 811-1285-232
                    </a>
                    <p className="text-sm text-zinc-500 mt-1">
                      Monday - Friday, 9:00 AM - 5:00 PM WIB
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Business Hours</h3>
                    <div className="text-zinc-400 space-y-1">
                      <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                      <p>Saturday: 9:00 AM - 1:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                    <p className="text-sm text-zinc-500 mt-2">
                      (Western Indonesia Time - WIB)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Categories */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">
                How Can We Help?
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <MessageCircle className="w-6 h-6 text-blue-400 mb-2" />
                  <h3 className="text-white font-semibold text-sm mb-1">
                    Technical Support
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Platform issues, bugs, and technical questions
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <Mail className="w-6 h-6 text-green-400 mb-2" />
                  <h3 className="text-white font-semibold text-sm mb-1">
                    Account & Billing
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Subscriptions, payments, and account management
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <Send className="w-6 h-6 text-purple-400 mb-2" />
                  <h3 className="text-white font-semibold text-sm mb-1">
                    Partnerships
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Business inquiries and collaboration opportunities
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <MessageCircle className="w-6 h-6 text-orange-400 mb-2" />
                  <h3 className="text-white font-semibold text-sm mb-1">
                    Feedback
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Suggestions and feature requests
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Contact */}
            <div className="p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
              <h3 className="text-white font-semibold mb-2">
                Need Immediate Assistance?
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                For urgent matters during business hours, please call us directly. Our support team is ready to assist you.
              </p>
              <a
                href="tel:+6281112852 32"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Send Us a Message
            </h2>
            <form className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="+62 812-3456-7890"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-zinc-300 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select a subject</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Account & Billing</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              {/* Privacy Notice */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="privacy"
                  name="privacy"
                  required
                  className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="privacy" className="text-sm text-zinc-400">
                  I agree to the{" "}
                  <Link href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms-and-conditions" className="text-blue-400 hover:text-blue-300 underline">
                    Terms and Conditions
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors flex items-center justify-center gap-2 group"
              >
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                Send Message
              </button>

              <p className="text-xs text-zinc-500 text-center">
                We typically respond within 24 hours during business days
              </p>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-zinc-400">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-4">
            <details className="group p-6 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <summary className="cursor-pointer text-white font-semibold flex items-center justify-between">
                How do I get started with IKODIO?
                <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 leading-relaxed">
                Simply sign up for an account, complete the KYC verification process, choose your subscription plan, and start exploring our AI-powered stock predictions. We offer a free trial for new users to test our platform.
              </p>
            </details>

            <details className="group p-6 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <summary className="cursor-pointer text-white font-semibold flex items-center justify-between">
                What payment methods do you accept?
                <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 leading-relaxed">
                We accept major credit cards (Visa, Mastercard, JCB), Indonesian bank transfers, e-wallets (GoPay, OVO, DANA), and other local payment methods through our secure payment processors.
              </p>
            </details>

            <details className="group p-6 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <summary className="cursor-pointer text-white font-semibold flex items-center justify-between">
                Is my data secure with IKODIO?
                <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 leading-relaxed">
                Yes, we implement industry-standard security measures including SSL/TLS encryption, secure authentication, and comply with Indonesian data protection laws (UU PDP). Your financial data and personal information are protected with bank-level security.
              </p>
            </details>

            <details className="group p-6 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <summary className="cursor-pointer text-white font-semibold flex items-center justify-between">
                Can I cancel my subscription anytime?
                <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 leading-relaxed">
                Yes, you can cancel your subscription at any time through your account settings. You'll retain access to paid features until the end of your current billing period. No refunds are provided for partial months.
              </p>
            </details>

            <details className="group p-6 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <summary className="cursor-pointer text-white font-semibold flex items-center justify-between">
                Do you provide investment advice?
                <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 leading-relaxed">
                No, IKODIO provides AI-powered predictions and analytics tools for informational purposes only. We do not provide financial advice or investment recommendations. All investment decisions are your responsibility, and we recommend consulting with licensed financial advisors.
              </p>
            </details>

            <details className="group p-6 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <summary className="cursor-pointer text-white font-semibold flex items-center justify-between">
                What stocks does IKODIO cover?
                <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 leading-relaxed">
                Currently, IKODIO focuses on Indonesian bluechip stocks listed on the Indonesia Stock Exchange (IDX), including major banks, telecommunications, automotive, and consumer goods companies. We're continuously expanding our coverage.
              </p>
            </details>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col md:flex-row gap-4 items-center justify-center">
            <Link
              href="/privacy-policy"
              className="text-zinc-400 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <span className="hidden md:block text-zinc-600">•</span>
            <Link
              href="/terms-and-conditions"
              className="text-zinc-400 hover:text-white transition-colors text-sm"
            >
              Terms and Conditions
            </Link>
            <span className="hidden md:block text-zinc-600">•</span>
            <a
              href="mailto:info@ikodio.com"
              className="text-zinc-400 hover:text-white transition-colors text-sm"
            >
              info@ikodio.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
