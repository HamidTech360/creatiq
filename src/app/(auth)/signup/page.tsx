'use client';

import { TextInput, PasswordInput, Button, Select, MultiSelect } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { signupValidator } from '@/validators';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getErrorMessage } from '@/utils/errors';

import { NICHES, PLATFORMS } from '@/utils/constants';

export default function SignupPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            full_name: '',
            email: '',
            password: '',
            whatsapp_number: '',
            niche: '',
            selected_platforms: [],
        },
        validate: yupResolver(signupValidator),
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        setError(null);
        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: values.email,
                password: values.password,
                options: {
                    data: {
                        full_name: values.full_name,
                    }
                }
            });

            if (authError) throw authError;

            if (authData.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: authData.user.id,
                        email: values.email,
                        full_name: values.full_name,
                        whatsapp_number: values.whatsapp_number,
                        niche: values.niche,
                        selected_platforms: values.selected_platforms,
                        onboarded: false,
                    });

                if (profileError) throw profileError;
                router.push('/onboarding');
            }
        } catch (err: any) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const inputStyles = {
        label: { marginBottom: 6, fontSize: 13, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'hsl(var(--muted-foreground))' },
        input: { backgroundColor: 'transparent' }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-display text-3xl font-black text-foreground tracking-tight">Create Identity</h1>
                <p className="mt-2 text-muted-foreground font-medium">Join the elite circle of creators using data-backed AI.</p>
            </div>

            <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-5">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-destructive/10 text-destructive text-sm p-4 rounded-2xl border border-destructive/20 font-bold"
                    >
                        {error}
                    </motion.div>
                )}

                <div className="space-y-4">
                    <TextInput
                        label="Full Name"
                        placeholder="e.g. Alex Morgan"
                        size="md"
                        radius="lg"
                        {...form.getInputProps('full_name')}
                        styles={inputStyles}
                    />

                    <TextInput
                        label="Email Address"
                        placeholder="your@email.com"
                        size="md"
                        radius="lg"
                        {...form.getInputProps('email')}
                        styles={inputStyles}
                    />

                    <PasswordInput
                        label="Secure Password"
                        placeholder="Min. 8 characters"
                        size="md"
                        radius="lg"
                        {...form.getInputProps('password')}
                        styles={inputStyles}
                    />

                    <TextInput
                        label="WhatsApp Number"
                        placeholder="+1 234 567 8900"
                        size="md"
                        radius="lg"
                        {...form.getInputProps('whatsapp_number')}
                        styles={inputStyles}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select
                            label="Primary Niche"
                            placeholder="Select one"
                            data={NICHES}
                            size="md"
                            radius="lg"
                            {...form.getInputProps('niche')}
                            styles={inputStyles}
                        />

                        <MultiSelect
                            label="Target Platforms"
                            placeholder="Select multi"
                            data={PLATFORMS}
                            size="md"
                            radius="lg"
                            {...form.getInputProps('selected_platforms')}
                            styles={inputStyles}
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    size="lg"
                    loading={loading}
                    className="gradient-primary h-14 w-full rounded-2xl font-black text-white shadow-glow border-0 transition-transform active:scale-95 mt-4"
                >
                    Create Account
                </Button>

                <p className="text-center text-sm text-muted-foreground pt-4 font-medium">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary font-black hover:underline no-underline">
                        Log In
                    </Link>
                </p>
            </form>
        </div>
    );
}
