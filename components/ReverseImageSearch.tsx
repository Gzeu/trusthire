'use client';

import React, { useState, useRef } from 'react';
import { Upload, Search, Info, ExternalLink, Loader2, CheckCircle, AlertTriangle, X } from 'lucide-react';

export interface ImageSearchResult {
  platform: 'yandex' | 'google';
  url: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface ReverseImageSearchProps {
  onImageUploaded?: (imageUrl: string) => void;
  className?: string;
}

export default function ReverseImageSearch({ onImageUploaded, className = '' }: ReverseImageSearchProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search platforms configuration
  const searchPlatforms: ImageSearchResult[] = [
    {
      platform: 'yandex',
      url: '',
      label: 'Search on Yandex Images',
      description: 'Best for face recognition and finding similar images',
      icon: <Search className="w-5 h-5" />
    },
    {
      platform: 'google',
      url: '',
      label: 'Search on Google Lens',
      description: 'Comprehensive image search with object detection',
      icon: <ExternalLink className="w-5 h-5" />
    }
  ];

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a JPG or PNG image');
      return;
    }

    if (file.size > maxSize) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Convert file to base64 data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setUploadedImage(dataUrl);
        setIsUploading(false);
        onImageUploaded?.(dataUrl);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploadError('Failed to upload image');
      setIsUploading(false);
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Generate search URLs
  const generateSearchUrls = () => {
    if (!uploadedImage) return [];

    return searchPlatforms.map(platform => {
      if (platform.platform === 'yandex') {
        // Yandex Images reverse search
        const yandexUrl = `https://yandex.com/images/search?rpt=imageview&url=${encodeURIComponent(uploadedImage)}`;
        return { ...platform, url: yandexUrl };
      } else {
        // Google Lens reverse search
        const googleUrl = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(uploadedImage)}`;
        return { ...platform, url: googleUrl };
      }
    });
  };

  // Handle search button click
  const handleSearchClick = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  // Clear uploaded image
  const clearImage = () => {
    setUploadedImage(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`bg-[#111113] border border-white/5 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
            <Search className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white font-mono">Profile Picture Analysis</h3>
            <p className="text-sm text-white/60">Detect if the photo is stolen, stock, or used in multiple fake profiles</p>
          </div>
        </div>
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="p-2 text-white/40 hover:text-white/60 transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
          {showTooltip && (
            <div className="absolute right-0 top-8 w-64 bg-[#1a1a1c] border border-white/10 rounded-lg p-3 z-50 shadow-xl">
              <h4 className="text-sm font-semibold text-white mb-2">Why this matters:</h4>
              <ul className="text-xs text-white/60 space-y-1">
                <li>Scammers often use stock photos or stolen images</li>
                <li>Reverse search can reveal the original source</li>
                <li>Helps identify fake profiles and catfishing attempts</li>
                <li>Yandex Images is especially good for face recognition</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Upload Area */}
      {!uploadedImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-purple-500/30 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
              <p className="text-white/60 font-mono text-sm">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-12 h-12 text-white/30" />
              <div>
                <p className="text-white/60 font-mono text-sm mb-1">
                  Drag & drop profile picture here
                </p>
                <p className="text-white/40 font-mono text-xs">
                  or click to browse (JPG/PNG, max 5MB)
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Image Preview */
        <div className="space-y-4">
          <div className="relative">
            <img
              src={uploadedImage}
              alt="Uploaded profile picture"
              className="w-full max-w-md mx-auto rounded-lg border border-white/10"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Success Message */}
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <p className="text-sm text-green-400 font-mono">
              Image uploaded successfully. Ready for reverse search.
            </p>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearchClick}
            disabled={isSearching}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-mono text-white font-semibold rounded-lg transition-colors"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Preparing search...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Search Image Online
              </>
            )}
          </button>

          {/* Search Options */}
          {isSearching === false && uploadedImage && (
            <div className="space-y-3">
              <p className="text-sm text-white/60 font-mono text-center">
                Choose search platform:
              </p>
              {generateSearchUrls().map((platform, index) => (
                <a
                  key={index}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      {platform.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-mono font-semibold">{platform.label}</h4>
                      <p className="text-xs text-white/60">{platform.description}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {uploadError && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <p className="text-sm text-red-400 font-mono">{uploadError}</p>
        </div>
      )}

      {/* Instructions */}
      {!uploadedImage && (
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-blue-400 font-mono mb-1">How it works:</h4>
              <ul className="text-xs text-blue-300 space-y-1">
                <li>Upload the recruiter's profile picture</li>
                <li>Click "Search Image Online" to prepare the image</li>
                <li>Choose Yandex Images (best for faces) or Google Lens</li>
                <li>Search results open in a new tab with reverse image lookup</li>
                <li>Look for multiple profiles using the same photo</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
