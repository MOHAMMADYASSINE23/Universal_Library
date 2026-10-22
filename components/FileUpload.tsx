"use client";

import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!;
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "light" | "dark";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setFile({ filePath: value ?? null });
  }, [value]);

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  const authenticator = async () => {
    const response = await fetch("/api/auth/imagekit", {
      method: "GET",
      cache: "no-store",
      credentials: "same-origin",
    });

    if (!response.ok) {
      throw new Error("Unable to authorize this upload.");
    }

    return response.json();
  };

  const onError = () => {
    setProgress(0);
    toast({
      title: `${type} Upload Failed`,
      description: "There was an error uploading your file. Please try again.",
      variant: "destructive",
    });
  };

  const onSuccess = (res: { filePath?: string }) => {
    if (!res.filePath) {
      onError();
      return;
    }

    setFile({ filePath: res.filePath });
    onFileChange(res.filePath);
    setProgress(100);
    toast({
      title: `${type} Upload Successful`,
      description: "Your file was uploaded successfully.",
    });
  };

  const onValidate = (selectedFile: File) => {
    const expectedType = type === "image" ? "image/" : "video/";
    const maxSize = type === "image" ? 20 : 50;

    if (!selectedFile.type.startsWith(expectedType)) {
      toast({
        title: "Unsupported file type",
        description: `Please choose a valid ${type} file.`,
        variant: "destructive",
      });
      return false;
    }

    if (selectedFile.size > maxSize * 1024 * 1024) {
      toast({
        title: "File size too large",
        description: `Please upload a file smaller than ${maxSize}MB.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        validateFile={onValidate}
        onUploadStart={() => setProgress(0)}
        onUploadProgress={({ loaded, total }) => {
          const percent = total > 0 ? Math.round((loaded / total) * 100) : 0;
          setProgress(percent);
        }}
        folder={folder}
        accept={accept}
        className="hidden"
      />

      <button
        type="button"
        className={cn("upload-btn", styles.button)}
        onClick={(event) => {
          event.preventDefault();

          if (ikUploadRef.current) {
            // @ts-ignore ImageKit's upload ref exposes click() at runtime.
            ikUploadRef.current?.click();
          }
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />

        <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>

        {file?.filePath && (
          <p className={cn("upload-filename", styles.text)}>
            {file.filePath}
          </p>
        )}
      </button>

      {progress > 0 && progress < 100 && (
        <div
          className="w-full rounded-full bg-green-200"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {file?.filePath &&
        (type === "image" ? (
          <IKImage
            alt={file.filePath}
            path={file.filePath}
            width={500}
            height={300}
          />
        ) : (
          <IKVideo
            path={file.filePath}
            controls={true}
            className="h-96 w-full rounded-xl"
          />
        ))}
    </ImageKitProvider>
  );
};

export default FileUpload;
