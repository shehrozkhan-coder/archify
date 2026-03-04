import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import PageNav from "components/PageNav";
import Footer from "components/Footer";

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "Perfect for getting started.",
    features: ["3 projects", "Basic rendering", "Community access", "JPG & PNG export"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    desc: "For serious designers and architects.",
    features: ["Unlimited projects", "HD 3D rendering", "Priority support", "All export formats", "Custom branding"],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For teams and organizations.",
    features: ["Everything in Pro", "Team collaboration", "SSO & admin panel", "SLA guarantee", "Dedicated support"],
    cta: "Contact Sales",
    highlight: false,
  },
];

const faqs = [
  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time with no questions asked." },
  { q: "Is there a free trial?", a: "Yes! The Pro plan comes with a 14-day free trial. No credit card required." },
  { q: "What export formats are supported?", a: "We support JPG, PNG, WebP, and SVG formats across all plans." },
  { q: "Do you offer student discounts?", a: "Yes, students get 50% off the Pro plan. Reach out to our support team." },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-white pb-20">
      <PageNav />

      <div className="max-w-5xl mx-auto px-6 pt-28">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-semibold text-orange-500 uppercase tracking-widest">Pricing</span>
          <h1 className="text-4xl font-bold text-gray-900 mt-3 mb-4">Simple, transparent pricing</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            No hidden fees. No surprises. Pick the plan that works for you.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 border flex flex-col gap-6 ${
                plan.highlight
                  ? "bg-orange-500 border-orange-500 text-white shadow-2xl shadow-orange-200 scale-105"
                  : "bg-white border-gray-200 text-gray-800"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <div>
                <h2 className={`text-lg font-bold mb-1 ${plan.highlight ? "text-white" : "text-gray-900"}`}>{plan.name}</h2>
                <p className={`text-sm ${plan.highlight ? "text-orange-100" : "text-gray-500"}`}>{plan.desc}</p>
              </div>
              <div className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                {plan.price}
                {plan.price !== "Custom" && (
                  <span className={`text-base font-medium ml-1 ${plan.highlight ? "text-orange-100" : "text-gray-400"}`}>/mo</span>
                )}
              </div>
              <ul className="flex flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={15} className={plan.highlight ? "text-white" : "text-orange-500"} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`mt-auto py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                  plan.highlight
                    ? "bg-white text-orange-500 hover:bg-orange-50"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    
      <Footer />
    </div>
  );
};

export default Pricing;