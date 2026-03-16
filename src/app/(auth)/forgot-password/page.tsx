'use client';

import { TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const form = useForm({
        initialValues: {
            email: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        setError(null);
        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(values.email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) throw resetError;

            setSuccess(true);
            // After 2-3 seconds, redirect to reset-password with email in query
            setTimeout(() => {
                router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to send recovery code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <Link 
                href="/login" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs font-black uppercase tracking-widest no-underline mb-4"
            >
                <ArrowLeft size={14} /> Back to Hub
            </Link>

            <div>
                <h1 className="font-display text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                    <KeyRound className="text-primary" /> Recovery Access
                </h1>
                <p className="mt-2 text-muted-foreground font-medium">Re-authorize your entry with a direct security code.</p>
            </div>

            <AnimatePresence mode="wait">
                {success ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass border-primary/20 p-8 rounded-[2rem] text-center space-y-4"
                    >
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                            <Mail size={32} />
                        </div>
                        <h2 className="text-xl font-black text-foreground">Code Transmitted</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            A secure 6-digit access code has been sent to your email. Redirecting you to authorization...
                        </p>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onSubmit={form.onSubmit(handleSubmit)} 
                        className="space-y-6"
                    >
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-destructive/10 text-destructive text-sm p-4 rounded-2xl border border-destructive/20 font-bold"
                            >
                                {error}
                            </motion.div>
                        )}

                        <TextInput
                            label="Email Identity"
                            placeholder="your@email.com"
                            size="md"
                            radius="lg"
                            {...form.getInputProps('email')}
                            styles={{
                                label: { marginBottom: 6, fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(var(--muted-foreground))' },
                                input: { backgroundColor: 'transparent' }
                            }}
                        />

                        <Button
                            type="submit"
                            size="lg"
                            loading={loading}
                            className="gradient-primary h-14 w-full rounded-2xl font-black text-white shadow-glow border-0 transition-transform active:scale-95"
                        >
                            Request Access Code
                        </Button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}
