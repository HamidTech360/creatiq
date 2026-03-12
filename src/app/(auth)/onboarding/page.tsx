'use client';

import { TextInput, Button, Select, Switch, Stepper } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { onboardingValidator } from '@/validators';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { markOnboarded, updateProfile } from '@/services/profile';
import { updateNotificationSettings } from '@/services/notifications';
import { ChevronRight, ChevronLeft, Sparkles, Bell, CheckCircle2 } from 'lucide-react';

import { TONES as VOICES, FREQUENCIES } from '@/utils/constants';

export default function OnboardingPage() {
    const router = useRouter();
    const supabase = createClient();
    const [activeStep, setActiveStep] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) setUserId(data.user.id);
        });
    }, [supabase]);

    const form = useForm({
        initialValues: {
            brand_voice: '',
            posting_frequency: '',
            whatsapp_enabled: false,
            delivery_time: '07:00',
            whatsapp_number: '',
        },
        validate: yupResolver(onboardingValidator),
    });

    const nextStep = () => {
        if (activeStep === 0) {
            if (!form.values.brand_voice || !form.values.posting_frequency) {
                form.validate();
                return;
            }
        }
        setActiveStep((current) => (current < 2 ? current + 1 : current));
    };

    const prevStep = () => setActiveStep((current) => (current > 0 ? current - 1 : current));

    const handleFinish = async () => {
        if (!userId) return;
        try {
            await updateProfile(userId, {
                brand_voice: form.values.brand_voice,
                posting_frequency: form.values.posting_frequency,
            });

            await updateNotificationSettings(userId, {
                whatsapp_enabled: form.values.whatsapp_enabled,
                delivery_time: form.values.delivery_time,
                whatsapp_number: form.values.whatsapp_number,
            });

            await markOnboarded(userId);
            router.push('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="mb-12">
                <Stepper active={activeStep} onStepClick={setActiveStep} color="blue">
                    <Stepper.Step label="Style" />
                    <Stepper.Step label="Alerts" />
                    <Stepper.Step label="Finish" />
                </Stepper>
            </div>

            <div className="min-h-[350px]">
                {activeStep === 0 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                                    <Sparkles size={20} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900">Define Your Voice</h3>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">This helps us write posts that sound just like you.</p>
                        </div>

                        <div className="space-y-6">
                            <Select
                                label="Choose brand voice"
                                placeholder="E.g. Professional"
                                data={VOICES}
                                size="md"
                                radius="md"
                                {...form.getInputProps('brand_voice')}
                            />

                            <Select
                                label="Choose posting frequency goal"
                                placeholder="E.g. Daily"
                                data={FREQUENCIES}
                                size="md"
                                radius="md"
                                {...form.getInputProps('posting_frequency')}
                            />
                        </div>
                    </div>
                )}

                {activeStep === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                                    <Bell size={20} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900">Stay on Track</h3>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">Get your trending digest via WhatsApp.</p>
                        </div>

                        <div className="space-y-8">
                            <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-gray-900">WhatsApp Digest</p>
                                    <p className="text-xs text-gray-500 font-medium">Receive updates daily</p>
                                </div>
                                <Switch
                                    size="lg"
                                    color="blue"
                                    {...form.getInputProps('whatsapp_enabled', { type: 'checkbox' })}
                                />
                            </div>

                            {form.values.whatsapp_enabled && (
                                <div className="space-y-6 p-2">
                                    <TextInput
                                        label="Confirm WhatsApp Number"
                                        placeholder="+1234567890"
                                        size="md"
                                        radius="md"
                                        {...form.getInputProps('whatsapp_number')}
                                    />
                                    <TextInput
                                        label="Preferred delivery time"
                                        type="time"
                                        size="md"
                                        radius="md"
                                        {...form.getInputProps('delivery_time')}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeStep === 2 && (
                    <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col items-center">
                            <div className="p-4 bg-green-50 rounded-full text-green-600 mb-6 border-4 border-white shadow-xl">
                                <CheckCircle2 size={48} />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-4">You&apos;re All Set!</h3>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
                                Your profile is ready. You can start discovering trending topics and generating content right away.
                            </p>
                        </div>

                        <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 text-left">
                            <p className="text-blue-900 font-black mb-2 flex items-center gap-2">
                                <Sparkles size={16} className="text-blue-600" /> Dashboard Ready
                            </p>
                            <p className="text-xs text-blue-700/70 font-bold uppercase tracking-widest">
                                Live Analytics & Trend Cards Active
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-50">
                {activeStep !== 0 ? (
                    <button
                        onClick={prevStep}
                        className="flex items-center gap-2 text-sm font-black text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft size={18} /> Back
                    </button>
                ) : <div />}

                {activeStep !== 2 ? (
                    <Button
                        onClick={nextStep}
                        size="lg"
                        radius="md"
                        className="px-8 h-14 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20"
                        rightSection={<ChevronRight size={18} />}
                    >
                        Next Step
                    </Button>
                ) : (
                    <Button
                        onClick={handleFinish}
                        size="lg"
                        radius="md"
                        className="px-8 h-14 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20"
                    >
                        Go to My Dashboard
                    </Button>
                )}
            </div>
        </div>
    );
}
