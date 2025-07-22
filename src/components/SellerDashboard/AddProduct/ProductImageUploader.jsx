import React, { useState, useEffect } from 'react';
import { Upload, X, Check, Plus } from 'lucide-react';

const ProductImageUploader = ({ onUpload, images = [] }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  useEffect(() => {
    // Initialize with existing images if provided
    if (images.length > 0) {
      setUploadedFiles(images);
      const urls = images.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  }, [images]);

  const handleFileChange = (files) => {
    const fileArray = Array.from(files);
    const totalFiles = uploadedFiles.length + fileArray.length;

    if (totalFiles > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} images allowed. You can upload ${MAX_FILES - uploadedFiles.length} more.`);
      return;
    }

    const validFiles = [];
    const newPreviewUrls = [];
    let hasError = false;

    fileArray.forEach(file => {
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        setError('Only PNG or JPEG files are allowed.');
        hasError = true;
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError('File size exceeds 5MB limit.');
        hasError = true;
        return;
      }
      validFiles.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    });

    if (!hasError && validFiles.length > 0) {
      setError('');
      const updatedFiles = [...uploadedFiles, ...validFiles];
      const updatedUrls = [...previewUrls, ...newPreviewUrls];
      
      setUploadedFiles(updatedFiles);
      setPreviewUrls(updatedUrls);
      onUpload(updatedFiles);
    }
  };

  const handleInputChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      handleFileChange(files);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (index) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    const updatedUrls = previewUrls.filter((_, i) => i !== index);
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    setUploadedFiles(updatedFiles);
    setPreviewUrls(updatedUrls);
    onUpload(updatedFiles);
    setError('');
  };

  const canAddMore = uploadedFiles.length < MAX_FILES;

  useEffect(() => {
    return () => {
      // Cleanup all preview URLs on unmount
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-500">
        Upload Product Images ({uploadedFiles.length}/{MAX_FILES})
      </h3>

      {/* Display uploaded images */}
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={previewUrls[index]}
                alt={`Product ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border-2 border-green-200"
              />
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
              >
                <X size={14} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
            isDragOver
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
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
          
          <div className="space-y-3">
            <div className="flex justify-center">
              {uploadedFiles.length > 0 ? (
                <Plus size={32} className="text-gray-400" />
              ) : (
                <Upload size={48} className="text-gray-400" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                {uploadedFiles.length > 0 
                  ? `Add more images (${MAX_FILES - uploadedFiles.length} remaining)`
                  : 'Click to upload or drag and drop'
                }
              </p>
              <p className="text-xs text-gray-500">
                Maximum file size: 5MB per image (PNG or JPEG)
              </p>
            </div>
            <button
              type="button"
              onClick={() => document.getElementById('productImageInput').click()}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              {uploadedFiles.length > 0 ? 'Add More' : 'Upload Images'}
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <Check size={16} className="text-green-600" />
            <span>
              {uploadedFiles.length} image{uploadedFiles.length > 1 ? 's' : ''} uploaded successfully
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageUploader;