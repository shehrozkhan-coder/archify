import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, BookOpen, TrendingUp, Rss } from "lucide-react";
import PageNav from "components/PageNav";
import Footer from "components/Footer";

const posts = [
  {
    tag: "Product",
    title: "Introducing Archify 2.0 — The Future of Architecture Design",
    desc: "We've completely reimagined how architects and designers interact with AI. Here's everything that's new.",
    date: "March 1, 2026",
    read: "5 min read",
    highlight: true,
  },
  {
    tag: "Tutorial",
    title: "How to turn a 2D floor plan into a 3D render in under 60 seconds",
    desc: "A step-by-step walkthrough of Archify's AI rendering pipeline and how to get the best results.",
    date: "Feb 20, 2026",
    read: "4 min read",
    highlight: false,
  },
  {
    tag: "Design",
    title: "Top 5 architectural styles trending in 2026",
    desc: "From biophilic interiors to brutalist revivals — we break down what's capturing the imagination of designers globally.",
    date: "Feb 10, 2026",
    read: "6 min read",
    highlight: false,
  },
  {
    tag: "Engineering",
    title: "How we built real-time AI rendering with Puter.js",
    desc: "A deep dive into the technical decisions behind Archify's rendering engine and the tradeoffs we made.",
    date: "Jan 28, 2026",
    read: "8 min read",
    highlight: false,
  },
];

const tagColors: Record<string, string> = {
  Product: "bg-orange-100 text-orange-600",
  Tutorial: "bg-blue-100 text-blue-600",
  Design: "bg-purple-100 text-purple-600",
  Engineering: "bg-green-100 text-green-600",
};

const topics = [
  { icon: BookOpen, label: "Tutorials", count: "12 articles" },
  { icon: TrendingUp, label: "Design Trends", count: "8 articles" },
  { icon: Rss, label: "Product Updates", count: "5 articles" },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-white pb-20">
      <PageNav />

      <div className="max-w-5xl mx-auto px-6 pt-28">

        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-semibold text-orange-500 uppercase tracking-widest">Blog</span>
          <h1 className="text-4xl font-bold text-gray-900 mt-3 mb-3">Stories & Updates</h1>
          <p className="text-gray-500 text-lg">Insights from the Archify team on design, AI, and the future of architecture.</p>
        </motion.div>

        {/* Topics row */}
        <motion.div
          className="flex flex-wrap gap-3 mb-14"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          {topics.map(({ icon: Icon, label, count }) => (
            <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-600 cursor-pointer hover:border-orange-300 hover:text-orange-600 transition-all duration-200">
              <Icon size={14} />
              <span className="font-medium">{label}</span>
              <span className="text-gray-400 text-xs">· {count}</span>
            </div>
          ))}
        </motion.div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {posts.map((post, i) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`group rounded-2xl border border-gray-100 p-7 cursor-pointer hover:shadow-lg transition-all duration-200 flex flex-col gap-4 ${
                post.highlight ? "md:col-span-2 bg-gray-950 text-white border-gray-900" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  post.highlight ? "bg-orange-500 text-white" : tagColors[post.tag]
                }`}>
                  {post.tag}
                </span>
                <ArrowUpRight
                  size={18}
                  className={`transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 ${
                    post.highlight ? "text-gray-400" : "text-gray-300"
                  }`}
                />
              </div>
              <div>
                <h2 className={`font-bold text-lg mb-2 leading-snug ${post.highlight ? "text-white" : "text-gray-900"}`}>
                  {post.title}
                </h2>
                <p className={`text-sm leading-relaxed ${post.highlight ? "text-gray-400" : "text-gray-500"}`}>
                  {post.desc}
                </p>
              </div>
              <div className={`flex items-center gap-3 text-xs mt-auto ${post.highlight ? "text-gray-500" : "text-gray-400"}`}>
                <Clock size={12} />
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.read}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gray-950 rounded-3xl px-10 py-14 text-center"
        >
          <span className="text-xs font-semibold text-orange-400 uppercase tracking-widest">Newsletter</span>
          <h2 className="text-2xl font-bold text-white mt-3 mb-3">Stay in the loop</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Get the latest articles, tutorials, and product updates delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              Subscribe →
            </motion.button>
          </div>
        </motion.div>

      </div>

      <Footer />
    </div>
  );
};

export default Blog;