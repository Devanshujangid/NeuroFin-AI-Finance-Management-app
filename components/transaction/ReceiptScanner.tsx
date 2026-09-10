"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

type ReceiptScannerProps = {
  onFileSelect: (file: File | null) => void;
  onScan: () => void;
  onRetry?: () => void;
  isScanning?: boolean;
  isSuccess?: boolean;
  error?: string;
};

export default function ReceiptScanner({
  onFileSelect,
  onScan,
  onRetry,
  isScanning = false,
  isSuccess = false,
  error = "",
}: ReceiptScannerProps) {
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setReceiptFile(null);
      setReceiptPreview(null);
      onFileSelect(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    // File type validation
    if (!allowedTypes.includes(file.type)) {
      setReceiptFile(null);
      setReceiptPreview(null);
      onFileSelect(null);

      setUploadError(
        "Unsupported file type. Please upload a JPG, PNG, or WebP image."
      );

      e.target.value = "";
      return;
    }

    // File size validation
    // Keep the existing intended limit of 5 MB.
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      setReceiptFile(null);
      setReceiptPreview(null);
      onFileSelect(null);

      setUploadError(
        "File is too large. Please upload an image smaller than 5 MB."
      );

      e.target.value = "";
      return;
    }

    // Valid file
    setUploadError("");
    setReceiptFile(file);
    onFileSelect(file);

    const previewUrl = URL.createObjectURL(file);
    setReceiptPreview(previewUrl);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Receipt
      </label>

      <div className="border-2 border-dashed rounded-xl p-6 text-center">
        <Input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          disabled={isScanning}
          className="
            file:bg-blue-600
            file:text-white
            file:border-0
            file:rounded-lg
            file:px-4
            file:py-1
            file:mr-4
            file:font-medium
            file:cursor-pointer
            hover:file:bg-blue-700
          "
        />

        {isScanning && (
  <p className="text-sm text-blue-600 font-medium mt-2">
    Scanning receipt...
  </p>
)}

{isSuccess && !isScanning && (
  <p className="text-sm text-green-600 font-medium mt-2">
    Receipt scanned successfully.
  </p>
)}

{error && !isScanning && (
  <div className="mt-2 space-y-2">
    <p className="text-sm text-red-500 font-medium">
      {error}
    </p>

    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
      >
        Try again
      </button>
    )}
  </div>
)}

        <p className="text-sm text-gray-500 mt-2">
          Upload a receipt image to scan it automatically
        </p>

        <p className="text-xs text-gray-400 mt-1">
          Supported formats: JPG, JPEG, PNG, WebP • Maximum size: 5 MB
        </p>

       
        {receiptFile && (
          <p className="text-sm text-gray-700 mt-2">
            Selected: {receiptFile.name}
          </p>
        )}

        {receiptPreview && (
          <div className="mt-4">
            <img
              src={receiptPreview}
              alt="Receipt preview"
              className="mx-auto max-h-64 rounded-lg border object-contain"
            />
          </div>
        )}

        {receiptFile && !isScanning && !isSuccess && (
          <button
            type="button"
            onClick={onScan}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Scan Receipt
          </button>
        )}
      </div>
    </div>
  );
}