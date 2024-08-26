"use client";

import { z } from "zod";
import { Button } from "./button";
import { Dialog, DialogContent, type DialogProps } from "./dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Input } from "./input";
import { IconExclamationCircle, IconPhoto, IconX } from "@tabler/icons-react";
import { unsplash, type UnsplashPhoto } from "@/libs/unsplash";
import { useDebouncedState } from "@/hooks/use-debounced-state";
import { ScrollArea } from "./scroll-area";
import { UnsplashPhotoViewer } from "./unsplash-photo-viewer";
import { useDropzone } from "react-dropzone";
import { Loader } from "./loader";
import { cn } from "@/utils/tailwind-helpers";
import { useState } from "react";
import { IMAGE_MIME_TYPE } from "@/types/utility.types";

const schema = z.object({
  url: z
    .string()
    .min(1, "Form name is a required field.")
    .url("Please enter a valid url"),
});

interface Props extends DialogProps {
  submit: (imageUrl: string, key?: string, name?: string) => Promise<void>;
  onUpload: (file: File) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
  showUnsplash?: boolean;
}

export function ImageUploader({
  onClose,
  open,
  submit,
  showUnsplash = true,
  onUpload,
}: Props) {
  const [queryString, setQueryString] = useDebouncedState("", 250);
  const [uploadError, setUploadError] = useState("");
  const [isUploadLoading, setUploadLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<{ url: string }>({
    resolver: zodResolver(schema),
  });

  const { getRootProps, getInputProps } = useDropzone({
    disabled: isUploadLoading,
    maxSize: 10000000,
    maxFiles: 1,
    accept: IMAGE_MIME_TYPE.reduce((r, key) => ({ ...r, [key]: [] }), {}),
    onDropAccepted: handleFileUpload,
    onDropRejected: handleFileRejectedErrors,
  });

  function handleFileRejectedErrors(
    files: { errors: { code: string; message: string }[] }[],
  ) {
    const error = files[0]?.errors[0];
    switch (error?.code) {
      case "file-too-large":
        setUploadError("File size should not exceed 10mb");
        break;
      case "file-invalid-type":
        setUploadError(error.message);
        break;
    }
  }

  async function handleFileUpload(files: File[]) {
    try {
      setUploadLoading(true);
      const file = files[0] as File;
      await onUpload(file);
      setUploadLoading(false);
      closeModal();
    } catch (error) {
      console.log(error);
      setUploadLoading(false);
    }
  }

  function closeModal() {
    onClose();
    reset({ url: "" });
    setQueryString("");
    setUploadError("");
  }

  const handleFormSubmit = async ({ url }: { url: string }) => {
    try {
      await submit(url);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryString(e.target.value);
  };

  const selectUnsplashImage = async (photo: UnsplashPhoto) => {
    await submit(photo.urls.regular);

    // Trigger unsplash download event
    await unsplash.photos.trackDownload({
      downloadLocation: photo.links.download_location,
    });

    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="relative p-0 sm:max-w-[650px]" hideCloseButton>
        <div>
          <Tabs className="w-full" defaultValue="upload">
            <TabsList className="space-x-0">
              <TabsTrigger
                className="rounded-tl-lg bg-white px-2 py-2 hover:bg-gray-100 [&>*]:hover:text-gray-900"
                value="upload"
              >
                Upload
              </TabsTrigger>
              <TabsTrigger
                className="bg-white px-2 py-2 hover:bg-gray-100 [&>*]:hover:text-gray-900"
                value="link"
              >
                Link
              </TabsTrigger>
              {showUnsplash && (
                <TabsTrigger
                  className="bg-white px-2 py-2 hover:bg-gray-100 [&>*]:hover:text-gray-900"
                  value="unsplash"
                >
                  Unsplash
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="upload" className="mt-0 p-4">
              {uploadError && (
                <div className="relative mb-4 rounded-md bg-red-50 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <IconExclamationCircle
                          className="h-5 w-5 text-red-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Error
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{uploadError}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute right-1 top-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-red-500 hover:bg-red-100 hover:text-red-500"
                      onClick={() => setUploadError("")}
                    >
                      <IconX size={16} />
                    </Button>
                  </div>
                </div>
              )}
              <section>
                <div
                  {...getRootProps({
                    className: cn(
                      "w-full h-[319px] flex flex-col justify-center items-center rounded-lg border border-dashed border-gray-900/25 py-10 hover:bg-gray-50 cursor-pointer",
                      isUploadLoading && "bg-gray-50 cursor-default",
                    ),
                  })}
                >
                  {isUploadLoading && <Loader />}
                  {!isUploadLoading && (
                    <>
                      <input {...getInputProps()} />
                      <IconPhoto className="h-12 w-12 text-gray-700" />
                      <p className="mt-4 text-lg">
                        Click to choose a file or drag image here
                      </p>
                      <p className="mt-4 text-sm text-gray-600">
                        Size limit: 10MB
                      </p>
                    </>
                  )}
                </div>
              </section>
            </TabsContent>
            <TabsContent value="link" className="mt-0 p-4">
              <div className="h-[319px]">
                <Input
                  placeholder="Paste any image link from the web"
                  {...register("url")}
                />
                <div className="mt-5 flex items-center justify-center">
                  <Button
                    onClick={handleSubmit(handleFormSubmit)}
                    loading={isSubmitting}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="unsplash" className="mt-0">
              <div className="px-4 pt-4">
                <Input
                  placeholder="Search for an image"
                  onChange={handleSearchChange}
                />
              </div>
              <ScrollArea className="h-[300px] w-full p-4">
                <UnsplashPhotoViewer
                  query={queryString}
                  selectImage={selectUnsplashImage}
                />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <div className="absolute right-1 top-[4px]">
          <Button
            variant="ghost"
            onClick={closeModal}
            className="h-8 w-8 text-gray-500"
          >
            <IconX size={16} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
