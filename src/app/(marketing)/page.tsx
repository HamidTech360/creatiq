'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, MessageSquare, Palette, ArrowRight, Zap, Target, Send, ChevronRight } from 'lucide-react';

const features = [
  { icon: TrendingUp, title: 'Daily AI Topics', desc: 'Get fresh trending topic ideas for your niche every morning, powered by AI.' },
  { icon: Palette, title: 'Platform-Specific Posts', desc: 'Generate posts perfectly formatted for LinkedIn, Twitter, Instagram & more.' },
  { icon: MessageSquare, title: 'WhatsApp Delivery', desc: 'Receive your daily content ideas straight to WhatsApp every morning.' },
  { icon: Target, title: 'Brand Voice Match', desc: 'Every post matches your unique voice — professional, casual, or bold.' },
];

const steps = [
  { num: '01', title: 'Pick Your Niche', desc: 'Select your industry and preferred platforms during setup.' },
  { num: '02', title: 'Get Daily Topics', desc: 'AI analyzes trends and delivers 10+ topic ideas every morning.' },
  { num: '03', title: 'Generate & Post', desc: 'Click generate, get 3 variations, copy, and post in seconds.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-body">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-glow">
              <Sparkles className="h-4 w-4 text-white" strokeWidth={3} />
            </div>
            <span className="font-display text-xl font-bold text-foreground">CreateIQ</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors no-underline">
              Log In
            </Link>
            <Link href="/signup" className="gradient-primary text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-glow transition-all hover:scale-105 active:scale-95 no-underline">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-20 md:pb-32">
        <div className="absolute inset-0 gradient-subtle opacity-60" />
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-info/5 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-black text-accent-foreground uppercase tracking-widest">
              <Sparkles className="h-4 w-4" />
              AI-Powered Content Ideas
            </div>
            <h1 className="font-display text-4xl font-black leading-tight text-gray-900 md:text-7xl md:leading-[1.1] tracking-tight">
              Turn trending topics into{' '}
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent italic">
                viral posts
              </span>
              {' '}— in seconds
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-500 md:text-xl font-medium leading-relaxed">
              CreateIQ discovers daily trending topics in your niche and generates ready-to-post content
              for LinkedIn, Twitter, Instagram, Facebook, and TikTok.
            </p>
            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/signup" className="w-full sm:w-auto gradient-primary text-white text-lg font-black px-10 py-5 rounded-2xl shadow-glow transition-all hover:scale-105 active:scale-95 no-underline flex items-center justify-center">
                Start Creating for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button disabled className="w-full sm:w-auto px-10 py-5 rounded-2xl text-lg font-black text-gray-400 bg-gray-50 border border-gray-200 cursor-not-allowed no-underline flex items-center justify-center">
                View Pricing (Coming Soon)
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-border bg-white flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale contrast-125">
          <span className="text-xl font-black tracking-tighter">LinkedIn</span>
          <span className="text-xl font-black tracking-tighter">Twitter-X</span>
          <span className="text-xl font-black tracking-tighter">Instagram</span>
          <span className="text-xl font-black tracking-tighter">TikTok</span>
          <span className="text-xl font-black tracking-tighter">Substack</span>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl font-black text-gray-900 md:text-5xl tracking-tight">
              Everything you need to <br /> <span className="text-primary italic">create consistently</span>
            </h2>
            <p className="mt-6 text-lg text-gray-500 font-medium max-w-2xl mx-auto">
              From idea discovery to post generation — all in one platform.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group rounded-3xl border border-border bg-card p-8 shadow-card transition-all hover:shadow-lg hover:-translate-y-2"
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl font-black text-gray-900 mb-3">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 md:py-32 gradient-subtle">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl font-black text-gray-900 md:text-5xl tracking-tight">
              How it works
            </h2>
            <p className="mt-6 text-lg text-gray-500 font-medium italic">Three simple steps to consistent content.</p>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center group"
              >
                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] gradient-primary text-white font-display text-2xl font-black shadow-glow transform group-hover:rotate-6 transition-transform">
                  {s.num}
                </div>
                <h3 className="font-display text-2xl font-black text-gray-900 mb-4">{s.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="rounded-[3rem] gradient-primary p-12 md:p-20 shadow-glow relative overflow-hidden group">
              <Sparkles className="absolute top-0 right-0 p-12 overflow-hidden opacity-10 pointer-events-none w-96 h-96 transition-transform group-hover:scale-110 duration-700" />

              <Zap className="mx-auto mb-6 h-12 w-12 text-white/90" />
              <h2 className="font-display text-4xl font-black text-white md:text-6xl tracking-tight leading-none mb-8">
                Ready to create <br /> <span className="italic opacity-90">smarter?</span>
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-white/80 text-lg font-medium leading-relaxed mb-12">
                Join thousands of creators who use CreateIQ to stay ahead of trends and post consistently.
              </p>
              <Link href="/signup" className="inline-flex items-center px-12 py-5 bg-white text-primary text-lg font-black rounded-2xl hover:bg-secondary transition-all shadow-xl no-underline">
                Get Started Free
                <Send className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-white">
        <div className="mx-auto flex flex-col md:flex-row items-center justify-between px-6 max-w-6xl gap-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md gradient-primary">
              <Sparkles className="h-3 w-3 text-white" strokeWidth={3} />
            </div>
            <span className="font-display text-lg font-bold text-gray-900 tracking-tight">CreateIQ</span>
          </div>

          <span className="font-display text-sm font-semibold text-gray-400">© 2026 CreateIQ. All rights reserved.</span>

          <div className="flex gap-8 text-sm font-black uppercase tracking-widest text-gray-400">
            <Link href="/login" className="hover:text-primary transition-colors no-underline">Log In</Link>
            <Link href="/signup" className="hover:text-primary transition-colors no-underline">Sign Up</Link>
            <span className="text-gray-300 cursor-not-allowed">Pricing</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
