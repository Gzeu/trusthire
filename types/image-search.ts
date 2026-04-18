// Types for Reverse Image Search functionality

export interface ImageSearchConfig {
  maxFileSize: number; // in bytes
  allowedTypes: string[];
  searchPlatforms: SearchPlatform[];
}

export interface SearchPlatform {
  id: 'yandex' | 'google';
  name: string;
  description: string;
  baseUrl: string;
  icon: string;
  recommended?: boolean;
}

export interface ImageUploadState {
  isUploading: boolean;
  uploadedImage: string | null;
  uploadError: string | null;
  isSearching: boolean;
}

export interface ImageSearchResult {
  platform: SearchPlatform['id'];
  searchUrl: string;
  timestamp: string;
}

export interface ImageAnalysisData {
  originalImageUrl: string;
  searchResults: ImageSearchResult[];
  analysisDate: string;
  metadata?: {
    fileSize: number;
    fileType: string;
    dimensions?: {
      width: number;
      height: number;
    };
  };
}

// Default configuration
export const DEFAULT_IMAGE_SEARCH_CONFIG: ImageSearchConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  searchPlatforms: [
    {
      id: 'yandex',
      name: 'Yandex Images',
      description: 'Best for face recognition and finding similar images',
      baseUrl: 'https://yandex.com/images/search',
      icon: 'search',
      recommended: true
    },
    {
      id: 'google',
      name: 'Google Lens',
      description: 'Comprehensive image search with object detection',
      baseUrl: 'https://lens.google.com/uploadbyurl',
      icon: 'external-link'
    }
  ]
};

// Utility functions
export const validateImageFile = (file: File, config: ImageSearchConfig): { isValid: boolean; error?: string } => {
  if (!config.allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Please upload a JPG or PNG image' };
  }
  
  if (file.size > config.maxFileSize) {
    return { isValid: false, error: 'Image size must be less than 5MB' };
  }
  
  return { isValid: true };
};

export const generateSearchUrls = (imageUrl: string, config: ImageSearchConfig): ImageSearchResult[] => {
  return config.searchPlatforms.map(platform => {
    let searchUrl: string;
    
    if (platform.id === 'yandex') {
      searchUrl = `${platform.baseUrl}?rpt=imageview&url=${encodeURIComponent(imageUrl)}`;
    } else {
      searchUrl = `${platform.baseUrl}?url=${encodeURIComponent(imageUrl)}`;
    }
    
    return {
      platform: platform.id,
      searchUrl,
      timestamp: new Date().toISOString()
    };
  });
};

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
