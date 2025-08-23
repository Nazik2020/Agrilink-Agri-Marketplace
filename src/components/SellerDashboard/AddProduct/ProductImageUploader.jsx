import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Upload, X, Check } from "lucide-react";

const ProductImageUploader = forwardRef(({ onUpload, imageFiles = [], maxImages = 5 }, ref) => {
  const [uploadedFiles, setUploadedFiles] = useState(imageFiles);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  // Expose clearImages function to parent component via ref
  useImperativeHandle(ref, () => ({
    clearImages: () => {
      clearAllImages();
    }
  }));

  // Function to clear all images
  const clearAllImages = () => {
    // Revoke all existing URLs to prevent memory leaks
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    // Clear state
    setUploadedFiles([]);
    setPreviewUrls([]);
    setError("");
    setIsDragOver(false);
    
    // Reset file input
    const fileInput = document.getElementById("productImageInput");
    if (fileInput) {
      fileInput.value = "";
    }
    
    // Notify parent component
    onUpload([]);
  };

  // Validate image type and size
  const validateFiles = (files) => {
    let validFiles = [];
    let errors = [];
    for (let file of files) {
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        errors.push(`${file.name}: Only PNG or JPEG files are allowed.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name}: File size exceeds 5MB limit.`);
        continue;
      }
      validFiles.push(file);
    }
    return { validFiles, errors };
  };

  const handleFilesChange = (files) => {
    let newFiles = Array.from(files);
    if (uploadedFiles.length + newFiles.length > maxImages) {
      setError(`You can upload up to ${maxImages} images.`);
      return;
    }
    const { validFiles, errors } = validateFiles(newFiles);
    if (errors.length > 0) {
      setError(errors.join(" "));
    } else {
      setError("");
    }
    const updatedFiles = [...uploadedFiles, ...validFiles];
    setUploadedFiles(updatedFiles);
    onUpload(updatedFiles);
  };

  const handleInputChange = (event) => {
    const files = event.target.files;
    handleFilesChange(files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    handleFilesChange(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (idx) => {
    // Revoke the URL for the removed file
    if (previewUrls[idx]) {
      URL.revokeObjectURL(previewUrls[idx]);
    }
    
    const updatedFiles = uploadedFiles.filter((_, i) => i !== idx);
    setUploadedFiles(updatedFiles);
    setError("");
    onUpload(updatedFiles);
  };

  useEffect(() => {
    // Revoke old URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    // Create new URLs
    const urls = uploadedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [uploadedFiles]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-500">
        Upload Product Images (up to {maxImages})
      </h3>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`max-w-full border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragOver
            ? "border-green-500 bg-green-50"
            : uploadedFiles.length > 0
            ? "border-green-400 bg-green-50"
            : "border-gray-300 hover:border-green-400 hover:bg-gray-50"
        }`}
      >
        <input
          type="file"
          className="hidden"
          id="productImageInput"
          accept="image/png,image/jpeg,image/jpg"
          multiple
          onChange={handleInputChange}
        />
        {uploadedFiles.length > 0 ? (
          <div className="flex flex-wrap gap-4 justify-center">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="relative">
                <img
                  src={previewUrls[idx]}
                  alt={`Product Preview ${idx + 1}`}
                  className="w-32 h-32 object-cover rounded-xl border-2 border-green-200"
                />
                <button
                  onClick={() => removeFile(idx)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                >
                  <X size={14} />
                </button>
                <div className="flex items-center justify-center space-x-2 text-green-600 mt-2">
                  <Check size={16} />
                  <span className="font-medium text-xs">{file.name}</span>
                </div>
                <p className="text-xs text-gray-500">{file.type}</p>
              </div>
            ))}
            {uploadedFiles.length < maxImages && (
              <button
                type="button"
                onClick={() =>
                  document.getElementById("productImageInput").click()
                }
                className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:border-green-400 hover:bg-green-50 transition-all duration-300"
              >
                <Upload size={32} className="text-gray-400 mb-2" />
                <span className="text-xs text-gray-600">Add More</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload size={48} className="text-gray-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                Maximum file size: 5MB per image (PNG or JPEG)
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                document.getElementById("productImageInput").click()
              }
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Upload Images
            </button>
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {uploadedFiles.length > 0 && (
          <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg mt-2">
            <div className="flex items-center space-x-2">
              <Check size={16} className="text-green-600" />
              <span>
                {uploadedFiles.length} image
                {uploadedFiles.length > 1 ? "s" : ""} uploaded successfully
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

ProductImageUploader.displayName = 'ProductImageUploader';

export default ProductImageUploader;