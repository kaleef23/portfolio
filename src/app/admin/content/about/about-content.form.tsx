'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useState } from 'react';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { SiteContent } from '@/lib/types';
import { updateSiteContent } from '@/app/admin/action';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
    col1: z.object({
        paragraph1: z.string().min(1, 'Paragraph 1 cannot be empty.'),
        paragraph2: z.string().min(1, 'Paragraph 2 cannot be empty.'),
    }),
    col2: z.object({
        paragraph1: z.string().min(1, 'Paragraph 1 cannot be empty.'),
        paragraph2: z.string().min(1, 'Paragraph 2 cannot be empty.'),
    }),
    exhibitions: z.string().min(10, 'Exhibitions list cannot be empty.'),
});

interface AboutContentFormProps {
    existingContent: SiteContent['about'];
}

interface Feedback {
    status: "Success" | "Error";
    message: string;
}

export default function AboutContentForm({
    existingContent,
}: AboutContentFormProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
    const [feedback, setFeedback] = useState<Feedback>();
    const TIMEOUT_DURATION: number = parseInt(process.env.NEXT_PUBLIC_TIMEOUT_DURATION || '15000', 10)

    const hideNotification = () => {
        setIsFeedbackVisible(false);
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            col1: {
                paragraph1: existingContent?.col1?.paragraph1 ?? '',
                paragraph2: existingContent?.col1?.paragraph2 ?? '',
            },
            col2: {
                paragraph1: existingContent?.col2?.paragraph1 ?? '',
                paragraph2: existingContent?.col2?.paragraph2 ?? '',
            },
            exhibitions: existingContent?.exhibitions ?? '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true)

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Request timed out. Please try again.'));
            }, TIMEOUT_DURATION);
        });

        try {
            // Filter out empty optional paragraphs before submitting
            const cleanedValues = {
                ...values,
                col1: {
                    ...values.col1,
                    paragraph2: values.col1.paragraph2 || ''
                },
                col2: {
                    ...values.col2,
                    paragraph2: values.col2.paragraph2 || ''
                }
            };

            const result = await Promise.race([
                updateSiteContent({ about: cleanedValues }),
                timeoutPromise
            ]) as { success: boolean; error?: string; };

            if (result.success) {
                setFeedback({
                    status: "Success", message: "saved!"
                })
            } else {
                setFeedback({
                    status: "Error", message: "Oops! an error occurred. please try again"
                })
                throw new Error(result.error);
            }
        } catch (error) {
            setFeedback({
                status: "Error", message: "Oops! an error occurred. please try again"
            })
            console.log(error instanceof Error ? error.message : 'An unknown error occurred.');

        } finally {
            setIsSubmitting(false);
            setIsFeedbackVisible(true);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4 rounded-md border p-4">
                    <h3 className="font-semibold text-lg">Column 1</h3>
                    <FormField
                        control={form.control}
                        name="col1.paragraph1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Paragraph 1</FormLabel>
                                <FormControl>
                                    <Textarea rows={5} placeholder="First paragraph for column 1..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="col1.paragraph2"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Paragraph 2</FormLabel>
                                <FormControl>
                                    <Textarea rows={5} placeholder="Second paragraph for column 1..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4 rounded-md border p-4">
                    <h3 className="font-semibold text-lg">Column 2</h3>
                    <FormField
                        control={form.control}
                        name="col2.paragraph1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Paragraph 1</FormLabel>
                                <FormControl>
                                    <Textarea rows={5} placeholder="First paragraph for column 2..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="col2.paragraph2"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Paragraph 2</FormLabel>
                                <FormControl>
                                    <Textarea rows={5} placeholder="Second paragraph for column 2..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Separator />

                <FormField
                    control={form.control}
                    name="exhibitions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Selected Exhibitions</FormLabel>
                            <FormControl>
                                <Textarea rows={5} placeholder="Enter one exhibition per line..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex space-x-4 items-center">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                    {
                        isFeedbackVisible &&
                        <div onClick={hideNotification} className={`${feedback?.status === "Success" ? "text-green-400" : "text-red-400"} flex space-x-2 cursor-pointer text-sm px-6`}>
                            <span>{feedback?.message}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
                            </svg>

                        </div>
                    }
                </div>
            </form>
        </Form>
    );
}