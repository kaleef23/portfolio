"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Collection } from "@/lib/types";
import { addCollection, updateCollection } from "@/app/admin/action";
import { X, UploadCloud, Loader2 } from "lucide-react";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  posterImageUrl: z.string().url("A poster image is required."),
  posterImageCategory: z.enum(["image", "video"]).optional(),
  tag: z.string().optional(),
  // FIXED: Make orientation required with a default value
  orientation: z.enum(["portrait", "landscape"]).default("portrait"),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        category: z.enum(["image", "video"]).optional(),
      })
    )
    .min(1, "At least one collection image is required."),
});

interface CollectionFormProps {
  existingCollection?: Collection;
}

export default function CollectionForm({
  existingCollection,
}: CollectionFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState<
    "poster" | "collection" | null
  >(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
  });

  // FIXED: Ensure the orientation value is properly typed
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: existingCollection?.title ?? "",
      tag: existingCollection?.tag,
      // FIXED: Ensure the value is one of the valid enum values
      orientation: (existingCollection?.orientation as "portrait" | "landscape") ?? "portrait",
      posterImageUrl: existingCollection?.posterImageUrl ?? "",
      posterImageCategory: existingCollection?.posterImageCategory ?? "image",
      images: existingCollection?.images ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const handleSingleFileUpload = async (
    file: File,
    type: "poster" | "collection"
  ) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const { url, category } = await response.json();
    return { url, category };
  };

  const handlePosterUpload = async (file: File) => {
    if (!file) return;
    setIsUploading("poster");

    try {
      const { url, category } = await handleSingleFileUpload(file, "poster");
      form.setValue("posterImageUrl", url, { shouldValidate: true });
      form.setValue("posterImageCategory", category);
      toast({ title: "Success", description: "Poster uploaded successfully." });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Poster upload failed. Please try again.",
      });
    } finally {
      setIsUploading(null);
    }
  };

  const handleBulkUpload = async (files: FileList) => {
    setIsUploading("collection");
    setUploadProgress(0);
    setUploadStats({
      total: files.length,
      success: 0,
      failed: 0,
    });

    try {
      for (let i = 0; i < files.length; i++) {
        try {
          const file = files[i];
          const { url, category } = await handleSingleFileUpload(
            file,
            "collection"
          );
          append({ url, category });
          setUploadStats((prev) => ({
            ...prev,
            success: prev.success + 1,
          }));
        } catch (error) {
          console.error(`Error uploading file ${i + 1}:`, error);
          setUploadStats((prev) => ({
            ...prev,
            failed: prev.failed + 1,
          }));
        }
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      if (uploadStats.failed > 0) {
        toast({
          variant: uploadStats.failed === files.length ? "destructive" : "default",
          title: uploadStats.failed === files.length ? "Error" : "Partial Success",
          description:
            uploadStats.failed === files.length
              ? "All files failed to upload"
              : `Uploaded ${uploadStats.success} of ${files.length} files`,
        });
      } else {
        toast({
          title: "Success",
          description: "All files uploaded successfully.",
        });
      }
    } finally {
      setIsUploading(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const result = existingCollection
        ? await updateCollection(existingCollection.id, values)
        : await addCollection(values);

      if (!result.success) throw new Error(result.error);

      toast({
        title: "Success",
        description: existingCollection
          ? "Collection updated successfully."
          : "Collection added successfully.",
      });

      router.push("/admin");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Collection Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tag (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="artistic">Artistic</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Orientation field */}
        <FormField
          control={form.control}
          name="orientation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Orientation</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value} // FIXED: Added explicit value prop
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select orientation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="posterImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poster Media</FormLabel>
              <FormControl>
                <div>
                  <Input
                    type="file"
                    className="hidden"
                    id="poster-upload"
                    onChange={(e) =>
                      e.target.files && handlePosterUpload(e.target.files[0])
                    }
                    disabled={isUploading === "poster"}
                    accept="image/*,video/*"
                  />
                  <label
                    htmlFor="poster-upload"
                    className="mt-2 flex justify-center w-full px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary"
                  >
                    <div className="space-y-1 text-center">
                      {isUploading === "poster" ? (
                        <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                      ) : (
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <p className="text-sm text-gray-600">
                        {isUploading === "poster"
                          ? "Uploading..."
                          : "Click to upload poster"}
                      </p>
                    </div>
                  </label>
                  {field.value && (
                    <div className="mt-4 relative w-40 h-40">
                      {form.getValues("posterImageCategory") === "video" ? (
                        <video
                          src={field.value}
                          controls
                          className="w-full h-full rounded-md object-cover"
                        />
                      ) : (
                        <Image
                          src={field.value}
                          alt="Poster preview"
                          fill
                          className="rounded-md object-cover"
                        />
                      )}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <div className="space-y-4">
          <FormLabel>Collection Media</FormLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {fields.map((item, index) => (
              <div key={item.id} className="relative group">
                {item.category === "video" ? (
                  <video
                    src={item.url}
                    controls
                    className="w-full h-full rounded-md object-cover aspect-square"
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={`Collection image ${index + 1}`}
                    className="rounded-md object-cover aspect-square"
                    data-ai-hint="portrait fashion"
                  />
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div>
              <Input
                type="file"
                className="hidden"
                id="collection-upload"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    handleBulkUpload(e.target.files);
                  }
                }}
                disabled={isUploading === "collection"}
                accept="image/*,video/*"
              />
              <label
                htmlFor="collection-upload"
                className="flex items-center justify-center w-full h-full aspect-square border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary"
              >
                <div className="space-y-1 text-center">
                  {isUploading === "collection" ? (
                    <>
                      <Loader2 className="mx-auto h-8 w-8 text-gray-400 animate-spin" />
                      <p className="text-xs text-gray-600">
                        Uploading ({Math.round(uploadProgress)}%)
                      </p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="text-xs text-gray-600">Add Media</p>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>
          
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {uploadStats.success} succeeded • {uploadStats.failed} failed •{" "}
                {uploadStats.total} total
              </p>
            </div>
          <FormMessage>{form.formState.errors.images?.message}</FormMessage>
        </div>

        <Button type="submit" disabled={isSubmitting || !!isUploading}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : existingCollection ? (
            "Update Collection"
          ) : (
            "Create Collection"
          )}
        </Button>
      </form>
    </Form>
  );
}