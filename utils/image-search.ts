// Utility functions for Reverse Image Search

import { DEFAULT_IMAGE_SEARCH_CONFIG } from '@/types/image-search';

/**
 * Validates image file based on configuration
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  if (!DEFAULT_IMAGE_SEARCH_CONFIG.allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Please upload a JPG or PNG image' };
  }
  
  if (file.size > DEFAULT_IMAGE_SEARCH_CONFIG.maxFileSize) {
    const maxSizeMB = DEFAULT_IMAGE_SEARCH_CONFIG.maxFileSize / (1024 * 1024);
    return { isValid: false, error: `Image size must be less than ${maxSizeMB}MB` };
  }
  
  return { isValid: true };
};

/**
 * Converts file to base64 data URL
 */
export const convertFileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      resolve(dataUrl);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Gets image dimensions from data URL
 */
export const getImageDimensions = (imageUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
};

/**
 * Generates search URLs for different platforms
 */
export const generateSearchUrls = (imageUrl: string): Array<{ platform: string; url: string; label: string }> => {
  const platforms = DEFAULT_IMAGE_SEARCH_CONFIG.searchPlatforms;
  
  return platforms.map(platform => {
    let searchUrl: string;
    
    if (platform.id === 'yandex') {
      searchUrl = `${platform.baseUrl}?rpt=imageview&url=${encodeURIComponent(imageUrl)}`;
    } else {
      searchUrl = `${platform.baseUrl}?url=${encodeURIComponent(imageUrl)}`;
    }
    
    return {
      platform: platform.id,
      url: searchUrl,
      label: platform.name
    };
  });
};

/**
 * Formats file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Gets file extension from MIME type
 */
export const getFileExtension = (mimeType: string): string => {
  const extensions: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png'
  };
  
  return extensions[mimeType] || '.jpg';
};

/**
 * Creates a safe filename for download
 */
export const createSafeFilename = (originalName: string, timestamp: string): string => {
  // Remove special characters and replace with underscores
  const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${safeName}_${timestamp}`;
};

/**
 * Checks if image is square (common for profile pictures)
 */
export const isSquareImage = (width: number, height: number, tolerance: number = 0.1): boolean => {
  const ratio = width / height;
  return Math.abs(ratio - 1) <= tolerance;
};

/**
 * Checks if image dimensions are typical for profile pictures
 */
export const isProfilePictureSize = (width: number, height: number): boolean => {
  // Typical profile picture sizes: 200x200 to 800x800
  const minSize = 200;
  const maxSize = 800;
  
  return width >= minSize && width <= maxSize && 
         height >= minSize && height <= maxSize;
};

/**
 * Analyzes image for common profile picture characteristics
 */
export const analyzeProfilePicture = (width: number, height: number): {
  isSquare: boolean;
  isTypicalSize: boolean;
  aspectRatio: string;
  recommendations: string[];
} => {
  const isSquare = isSquareImage(width, height);
  const isTypicalSize = isProfilePictureSize(width, height);
  const aspectRatio = `${width}:${height}`;
  
  const recommendations: string[] = [];
  
  if (!isSquare) {
    recommendations.push('Profile pictures are typically square for consistency');
  }
  
  if (!isTypicalSize) {
    if (width < 200 || height < 200) {
      recommendations.push('Image is quite small - may appear blurry when enlarged');
    } else if (width > 800 || height > 800) {
      recommendations.push('Image is quite large - may be slow to load');
    }
  }
  
  return {
    isSquare,
    isTypicalSize,
    aspectRatio,
    recommendations
  };
};
