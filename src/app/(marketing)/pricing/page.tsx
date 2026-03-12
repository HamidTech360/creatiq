'use client';

import { Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
    const plans = [
        {
            name: 'Free',
            price: '0',
            description: 'Perfect for getting started with content creation.',
            features: [
                '3 AI Topics per day',
                'LinkedIn & Twitter support',
                '1 variation per topic',
                'Basic performance scoring',
            ],
            cta: 'Get Started',
            href: '/signup',
            highlight: false,
        },
        {
            name: 'Pro',
            price: '29',
            description: 'For serious creators who want to dominate the feed.',
            features: [
                'Unlimited AI Topics',
                'All platforms supported',
                '3 variations per topic',
                'Advanced brand voice sync',
                'WhatsApp Daily Digest',
                'Content Calendar access',
                'Priority support',
            ],
            cta: 'Go Pro Now',
            href: '/signup?plan=pro',
            highlight: true,
        },
    ];

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 sm:mb-24">
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 mb-6">
                        Simple, Transparent <span className="text-blue-600">Pricing</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-gray-500">
                        Choose the plan that fits your creation goals. No hidden fees, cancel anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`
                relative p-8 sm:p-12 rounded-[2.5rem] border transition-all duration-300
                ${plan.highlight
                                    ? 'border-blue-600 shadow-2xl shadow-blue-500/20 bg-white ring-4 ring-blue-50'
                                    : 'border-gray-100 shadow-sm hover:shadow-md bg-gray-50/50'}
              `}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 right-10 -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-gray-900">${plan.price}</span>
                                    <span className="text-gray-500 font-medium">/month</span>
                                </div>
                                <p className="mt-4 text-gray-500 text-sm leading-relaxed">{plan.description}</p>
                            </div>

                            <div className="flex-grow">
                                <ul className="space-y-4 list-none p-0 mb-12">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <div className={`mt-0.5 rounded-full p-1 ${plan.highlight ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                                                <Check size={14} strokeWidth={3} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link
                                href={plan.href}
                                className={`
                  inline-flex items-center justify-center w-full py-4 px-6 rounded-2xl text-lg font-bold transition-all no-underline
                  ${plan.highlight
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/25'
                                        : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50'}
                `}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-4 rounded-3xl bg-blue-50 border border-blue-100 max-w-2xl mx-auto">
                        <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <p className="text-sm text-blue-900 font-medium text-left">
                            <strong>Special Early Adopter Offer:</strong> Sign up today and get 20% off your first 3 months of Pro when we officially launch!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
