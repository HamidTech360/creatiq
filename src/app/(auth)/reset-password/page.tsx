'use client';

import { TextInput, PasswordInput, Button, PinInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromQuery = searchParams.get('email') || '';
    const supabase = createClient();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<'otp' | 'password'>('otp');

    const form = useForm({
        initialValues: {
            email: emailFromQuery,
            otp: '',
            password: '',
        },
        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            password: (val, values) => (step === 'password' && val.length < 8 ? 'Min. 8 characters' : null),
            otp: (val, values) => (step === 'otp' && val.length < 6 ? 'Code too short' : null),
        }
    });

    const handleVerifyOtp = async (values: typeof form.values) => {
        setLoading(true);
        setError(null);
        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email: values.email,
                token: values.otp,
                type: 'recovery',
            });

            if (verifyError) throw verifyError;

            setStep('password');
        } catch (err: any) {
            setError(err.message || 'Verification failed. Invalid or expired code.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (values: typeof form.values) => {
        setLoading(true);
        setError(null);
        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: values.password,
            });

            if (updateError) throw updateError;

            router.push('/login?reset=success');
        } catch (err: any) {
            setError(err.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <Link 
                href="/forgot-password" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs font-black uppercase tracking-widest no-underline mb-4"
            >
                <ArrowLeft size={14} /> Request New Code
            </Link>

            <div>
                <h1 className="font-display text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                    {step === 'otp' ? <ShieldCheck className="text-primary" /> : <Lock className="text-primary" />}
                    {step === 'otp' ? 'Verify Code' : 'Set Password'}
                </h1>
                <p className="mt-2 text-muted-foreground font-medium">
                    {step === 'otp' 
                        ? 'Enter the 8-digit access token sent to your email.' 
                        : 'Secure your hub with a new high-strength access key.'}
                </p>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-destructive/10 text-destructive text-sm p-4 rounded-2xl border border-destructive/20 font-bold"
                >
                    {error}
                </motion.div>
            )}

            {step === 'otp' ? (
                <form 
                    onSubmit={form.onSubmit(
                        (values) => {
                            console.log("Form valid, submitting:", values);
                            handleVerifyOtp(values);
                        },
                        (errors) => {
                            console.error("Form validation failed:", errors);
                            setError("Please ensure all fields are correctly filled. " + Object.values(errors).join(", "));
                        }
                    )} 
                    className="space-y-8"
                >
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

                    <div className="space-y-4">
                        <TextInput
                            label="Authorization Code"
                            placeholder="Enter 8-digit code"
                            size="lg"
                            radius="xl"
                            inputMode="numeric"
                            type="text"
                            pattern="[0-9]*"
                            {...form.getInputProps('otp')}
                            styles={{
                                label: { marginBottom: 6, fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(var(--muted-foreground))', textAlign: 'center' },
                                input: { 
                                    backgroundColor: 'transparent', 
                                    textAlign: 'center', 
                                    fontSize: 28, 
                                    fontWeight: 900,
                                    letterSpacing: '0.2em',
                                    height: 64,
                                    borderWidth: '2px'
                                }
                            }}
                        />
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        loading={loading}
                        disabled={form.values.otp.length < 6}
                        className="gradient-primary h-14 w-full rounded-2xl font-black text-white shadow-glow border-0 transition-transform active:scale-95"
                    >
                        Verify Identity
                    </Button>
                </form>
            ) : (
                <form onSubmit={form.onSubmit(handleUpdatePassword)} className="space-y-6">
                    <PasswordInput
                        label="New Access Key"
                        placeholder="Min. 8 characters"
                        size="md"
                        radius="lg"
                        {...form.getInputProps('password')}
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
                        Update Access Key
                    </Button>
                </form>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="text-center p-20 animate-pulse text-muted-foreground font-black uppercase tracking-widest text-xs">Syncing Authorization...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
