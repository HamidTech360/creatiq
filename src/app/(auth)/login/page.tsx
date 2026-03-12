'use client';

import { TextInput, PasswordInput, Button } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { loginValidator } from '@/validators';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getProfile } from '@/services/profile';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        validate: yupResolver(loginValidator),
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        setError(null);
        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            });

            if (authError) throw authError;

            if (authData.user) {
                try {
                    const profile = await getProfile(authData.user.id);
                    if (!profile) throw new Error('No profile found');
                } catch (e) {
                    await supabase.auth.signOut();
                    throw new Error('Access denied. No profile found for this account. Please sign up again.');
                }
            }

            router.push('/dashboard');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-display text-3xl font-black text-foreground tracking-tight">Access Hub</h1>
                <p className="mt-2 text-muted-foreground font-medium">Log in to your creator dashboard to continue dominating.</p>
            </div>

            <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-6">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-destructive/10 text-destructive text-sm p-4 rounded-2xl border border-destructive/20 font-bold"
                    >
                        {error}
                    </motion.div>
                )}

                <div className="space-y-5">
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

                    <div className="space-y-1.5">
                        <PasswordInput
                            label="Password"
                            placeholder="Enter your password"
                            size="md"
                            radius="lg"
                            {...form.getInputProps('password')}
                            styles={{
                                label: { marginBottom: 6, fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(var(--muted-foreground))' },
                                input: { backgroundColor: 'transparent' }
                            }}
                        />
                        <div className="text-right">
                            <Link href="/forgot-password" className="text-[11px] text-primary font-black hover:underline no-underline uppercase tracking-wider">
                                Recovery Access?
                            </Link>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    size="lg"
                    loading={loading}
                    className="gradient-primary h-14 w-full rounded-2xl font-black text-white shadow-glow border-0 transition-transform active:scale-95"
                >
                    Authorize Entry
                </Button>

                <p className="text-center text-sm text-muted-foreground pt-4 font-medium">
                    New to CreateIQ?{' '}
                    <Link href="/signup" className="text-primary font-black hover:underline no-underline">
                        Create Account
                    </Link>
                </p>
            </form>
        </div>
    );
}
