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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Collection } from "@/lib/types";
import { addCollection, updateCollection } from "@/app/admin/action";
import { X, UploadCloud, Loader2 } from "lucide-react";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  // description: z
  //   .string()
  //   .min(10, "Description must be at least 10 characters."),
  posterImageUrl: z.string().url("A poster image is required."),
  images: z
    .array(z.object({ url: z.string().url() }))
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: existingCollection?.title ?? "",
      // description: "",
      posterImageUrl: existingCollection?.posterImageUrl ?? "",
      images: existingCollection?.images ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const handleFileUpload = async (
    file: File,
    type: "poster" | "collection"
  ) => {
    if (!file) return;
    setIsUploading(type);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { url } = await response.json();

      if (type === "poster") {
        form.setValue("posterImageUrl", url, { shouldValidate: true });
      } else {
        append({ url });
      }

      toast({ title: "Success", description: "Image uploaded successfully." });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Image upload failed. Please try again.",
      });
    } finally {
      setIsUploading(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      let result;
      if (existingCollection) {
        result = await updateCollection(existingCollection.id, values);
        if (result.success) {
          toast({
            title: "Success",
            description: "Collection updated successfully.",
          });
          router.push("/admin");
        }
      } else {
        result = await addCollection(values);
        if (result.success) {
          toast({
            title: "Success",
            description: "Collection added successfully.",
          });
          router.push("/admin");
        }
      }

      if (!result.success) {
        throw new Error(result.error);
      }
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
        {/* <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Collection Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="posterImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poster Image</FormLabel>
              <FormControl>
                <div>
                  <Input
                    type="file"
                    className="hidden"
                    id="poster-upload"
                    onChange={(e) =>
                      e.target.files &&
                      handleFileUpload(e.target.files[0], "poster")
                    }
                    disabled={isUploading === "poster"}
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
                          : "Click to upload poster image"}
                      </p>
                    </div>
                  </label>
                  {field.value && (
                    <div className="mt-4 relative w-40 h-40">
                      <Image
                        src={field.value}
                        alt="Poster preview"
                        fill
                        className="rounded-md object-cover"
                        data-ai-hint="collection poster"
                      />
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
          <FormLabel>Collection Images</FormLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {fields.map((item, index) => (
              <div key={item.id} className="relative group">
                <Image
                  src={item.url}
                  alt={`Collection image ${index + 1}`}
                  width={200}
                  height={200}
                  className="rounded-md object-cover aspect-square"
                  data-ai-hint="collection image"
                />
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
                    Array.from(e.target.files).forEach((file) =>
                      handleFileUpload(file, "collection")
                    );
                  }
                }}
                disabled={isUploading === "collection"}
              />
              <label
                htmlFor="collection-upload"
                className="flex items-center justify-center w-full h-full aspect-square border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary"
              >
                <div className="space-y-1 text-center">
                  {isUploading === "collection" ? (
                    <Loader2 className="mx-auto h-8 w-8 text-gray-400 animate-spin" />
                  ) : (
                    <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                  )}
                  <p className="text-xs text-gray-600">Add Images</p>
                </div>
              </label>
            </div>
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
