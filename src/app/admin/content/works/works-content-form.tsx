'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import Image from 'next/image';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { WorksImages } from '@/lib/types';
import { updateWorksImages } from '@/app/admin/action';
import { Loader2, UploadCloud } from 'lucide-react';
import { uploadToFirebase } from '@/lib/firebaseUpload';

const formSchema = z.object({
    images: z.object({
        default: z.string().url('A valid image URL is required.'),
        artistic: z.string().url('A valid image URL is required.'),
        commercial: z.string().url('A valid image URL is required.'),
    })
});

interface WorksContentFormProps {
    existingContent: WorksImages['images'];
}

interface Feedback {
    status: "Success" | "Error";
    message: string;
}

export default function WorksContentForm({
    existingContent,
}: WorksContentFormProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState<'artistic' | 'commercial' | 'default' | null>(null);
    const [feedback, setFeedback] = useState<Feedback>();
    const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);

    const hideNotification = () => {
        setIsFeedbackVisible(false);
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            images: {
                default: existingContent?.default || '',
                artistic: existingContent?.artistic || '',
                commercial: existingContent?.commercial || '',
            }
        },
    });

    const { watch } = form;
    const images = watch('images');

    const handleFileUpload = async (file: File, type: 'artistic' | 'commercial' | 'default') => {
        if (!file) return;
        setIsUploading(type);

        const formData = new FormData();
        formData.append('file', file);

        try {

            const {url } = await uploadToFirebase(file);

            // const response = await fetch('/api/upload', {
            //     method: 'POST',
            //     body: formData,
            // });

            // if (!response.ok) throw new Error('Upload failed');
            // const { url } = await response.json();

            form.setValue(`images.${type}`, url, { shouldValidate: true });
            setFeedback({
                status: "Success", message: `${type} image uploaded successfully.`
            })
        } catch (error) {
            setFeedback({
                status: "Error", message: "Oops! an error occurred. please try again"
            })
        } finally {
            setIsUploading(null);
            setIsFeedbackVisible(true);
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await updateWorksImages(values);

            if (result.success) {
                setFeedback({
                    status: "Success", message: "Works page images updated successfully."
                })
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            setFeedback({
                status: "Error", message: "Oops! an error occurred. please try again"
            })
        } finally {
            setIsSubmitting(false);
            setIsFeedbackVisible(true);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Hidden form fields for each image URL */}
                <FormField
                    control={form.control}
                    name="images.default"
                    render={({ field }) => (
                        <FormItem className="hidden">
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="images.artistic"
                    render={({ field }) => (
                        <FormItem className="hidden">
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="images.commercial"
                    render={({ field }) => (
                        <FormItem className="hidden">
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Default Image Uploader */}
                    <div>
                        <FormLabel>Default Background Image</FormLabel>
                        <Input
                            type="file"
                            className="hidden"
                            id="default-upload"
                            accept="image/*"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'default')}
                            disabled={isUploading === 'default'}
                        />
                        <label
                            htmlFor="default-upload"
                            className="mt-2 flex justify-center w-full px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary"
                        >
                            <div className="space-y-1 text-center">
                                {isUploading === 'default' ? (
                                    <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                                ) : (
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                )}
                                <p className="text-sm text-gray-600">
                                    {isUploading === 'default' ? 'Uploading...' : 'Click to upload/change'}
                                </p>
                            </div>
                        </label>
                        {images.default && (
                            <div className="mt-4 relative w-full aspect-video">
                                <Image
                                    src={images.default}
                                    alt="Default preview"
                                    fill
                                    className="rounded-md object-cover"
                                />
                            </div>
                        )}
                        <FormMessage>
                            {form.formState.errors.images?.default?.message}
                        </FormMessage>
                    </div>

                    {/* Artistic Image Uploader */}
                    <div>
                        <FormLabel>Artistic Background Image</FormLabel>
                        <Input
                            type="file"
                            className="hidden"
                            id="artistic-upload"
                            accept="image/*"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'artistic')}
                            disabled={isUploading === 'artistic'}
                        />
                        <label
                            htmlFor="artistic-upload"
                            className="mt-2 flex justify-center w-full px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary"
                        >
                            <div className="space-y-1 text-center">
                                {isUploading === 'artistic' ? (
                                    <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                                ) : (
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                )}
                                <p className="text-sm text-gray-600">
                                    {isUploading === 'artistic' ? 'Uploading...' : 'Click to upload/change'}
                                </p>
                            </div>
                        </label>
                        {images.artistic && (
                            <div className="mt-4 relative w-full aspect-video">
                                <Image
                                    src={images.artistic}
                                    alt="Artistic preview"
                                    fill
                                    className="rounded-md object-cover"
                                />
                            </div>
                        )}
                        <FormMessage>
                            {form.formState.errors.images?.artistic?.message}
                        </FormMessage>
                    </div>

                    {/* Commercial Image Uploader */}
                    <div>
                        <FormLabel>Commercial Background Image</FormLabel>
                        <Input
                            type="file"
                            className="hidden"
                            id="commercial-upload"
                            accept="image/*"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'commercial')}
                            disabled={isUploading === 'commercial'}
                        />
                        <label
                            htmlFor="commercial-upload"
                            className="mt-2 flex justify-center w-full px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary"
                        >
                            <div className="space-y-1 text-center">
                                {isUploading === 'commercial' ? (
                                    <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                                ) : (
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                )}
                                <p className="text-sm text-gray-600">
                                    {isUploading === 'commercial' ? 'Uploading...' : 'Click to upload/change'}
                                </p>
                            </div>
                        </label>
                        {images.commercial && (
                            <div className="mt-4 relative w-full aspect-video">
                                <Image
                                    src={images.commercial}
                                    alt="Commercial preview"
                                    fill
                                    className="rounded-md object-cover"
                                />
                            </div>
                        )}
                        <FormMessage>
                            {form.formState.errors.images?.commercial?.message}
                        </FormMessage>
                    </div>
                </div>

                <div className="flex space-x-4 items-center">
                    <Button type="submit" disabled={isSubmitting || !!isUploading}>
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