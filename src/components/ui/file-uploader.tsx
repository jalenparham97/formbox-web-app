import { MIME_TYPES } from "@/utils/constants";
import { cn } from "@/utils/tailwind-helpers";
import {
  IconCheck,
  IconExclamationCircle,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Loader } from "./loader";
import {
  useFileDeleteMutation,
  useFileUploadUrlMutation,
} from "@/queries/storage.queries";
import { nanoid } from "@/libs/nanoid";
import { env } from "@/env";
import { Button } from "./button";
import { type FormFile } from "@/types/form.types";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  onUploadComplete?: (file: FormFile) => void;
  orgId?: string;
}

export function FileUploader({
  className,
  style,
  onUploadComplete,
  orgId,
}: Props) {
  const [uploadError, setUploadError] = useState("");
  const [isUploadLoading, setUploadLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const uploadUrlMutation = useFileUploadUrlMutation();
  const deleteFileMutation = useFileDeleteMutation();

  const { getRootProps, getInputProps } = useDropzone({
    disabled: isUploadLoading,
    maxSize: 10000000,
    maxFiles: 1,
    accept: Object.values(MIME_TYPES).reduce(
      (r, key) => ({ ...r, [key]: [] }),
      {},
    ),
    onDropAccepted: handleFileUpload,
    onDropRejected: handleFileRejectedErrors,
  });

  async function onFileUpload(file: File) {
    // await deleteCurrentUserImage(user?.image);
    console.log("file: ", file);

    const fileKey = `${orgId}-${nanoid()}-${file.name}`;
    const { uploadUrl } = await uploadUrlMutation.mutateAsync({
      fileKey,
    });
    if (uploadUrl) {
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "multiport/formdata" },
        body: file,
      });
      setFileName(file.name);
      return `${env.NEXT_PUBLIC_R2_PUBLIC_BUCKET_URL}/${fileKey}`;
    }
  }

  function handleFileRejectedErrors(
    files: { errors: { code: string; message: string }[] }[],
  ) {
    const error = files[0]?.errors[0];
    switch (error?.code) {
      case "too-many-files":
        setUploadError("You can only upload one file at a time");
        break;
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
      const fileUrl = await onFileUpload(file);
      if (fileUrl) {
        onUploadComplete?.({
          name: file.name,
          type: file.type,
          url: fileUrl,
          size: file.size,
        });
      }
      setUploadLoading(false);
    } catch (error) {
      console.log(error);
      setUploadLoading(false);
    }
  }

  return (
    <>
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
                <h3 className="text-sm font-medium text-red-800">Error</h3>
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
      <div
        {...getRootProps({
          className: cn(
            "w-full h-[150px] flex flex-col justify-center items-center rounded-lg border border-dashed border-gray-900/25 py-10 hover:bg-gray-50 cursor-pointer bg-white shadow-sm",
            isUploadLoading && "bg-gray-50 cursor-default",
            className,
          ),
        })}
        style={style}
      >
        {isUploadLoading && <Loader />}
        {!isUploadLoading && !fileName && (
          <>
            <input {...getInputProps()} />
            <div>
              <IconUpload className="h-6 w-6 text-gray-700" />
            </div>
            <p className="mt-4">Click to choose a file or drag image here</p>
            <p className="mt-4 text-sm text-gray-600">Size limit: 10MB</p>
          </>
        )}
        {!isUploadLoading && fileName && (
          <>
            <input {...getInputProps()} />
            <div>
              <IconCheck className="h-6 w-6 text-green-500" />
            </div>
            <p className="mt-4">{fileName} uploaded successfully</p>
          </>
        )}
      </div>
    </>
  );
}
