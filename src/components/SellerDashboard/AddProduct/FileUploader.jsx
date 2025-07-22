import React, { useState, useEffect } from 'react';
import { Upload, X, Check } from 'lucide-react';

const FileUploader = ({ onUpload }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (file) => {
    if (file) {
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        setError('Only PNG or JPEG files are allowed.');
        setUploadedFile(null);
        setPreviewUrl(null);
        return;
      }
      if (file.size > 1024 * 1024) {
        setError('File size exceeds 1MB limit.');
        setUploadedFile(null);
        setPreviewUrl(null);
        return;
      }
      setError('');
      const url = URL.createObjectURL(file);
      setUploadedFile(file);
      setPreviewUrl(url);
      onUpload(file);
    }
  };

  const handleInputChange = (event) => {
    const file = event.target.files[0];
    handleFileChange(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setError('');
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-500">Upload Business Logo</h3>
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-green-500 bg-green-50'
            : uploadedFile
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
        }`}
      >
        <input
          type="file"
          className="hidden"
          id="fileInput"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleInputChange}
        />
        
        {uploadedFile ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Uploaded Logo"
                  className="w-18 h-18 object-cover rounded-xl border-2 border-green-200"
                />
                <button
                  onClick={removeFile}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <Check size={16} />
                <span className="font-medium">{uploadedFile.name}</span>
              </div>
              <p className="text-sm text-gray-500">{uploadedFile.type}</p>
              <button
                type="button"
                onClick={() => document.getElementById('fileInput').click()}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                Change Logo
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload size={48} className="text-gray-400" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                Maximum file size: 1MB (PNG or JPEG)
              </p>
            </div>
            <button
              type="button"
              onClick={() => document.getElementById('fileInput').click()}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Upload
            </button>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;