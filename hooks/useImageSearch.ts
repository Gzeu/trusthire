// Custom hook for Reverse Image Search functionality

import { useState, useCallback } from 'react';
import { 
  ImageUploadState, 
  ImageAnalysisData, 
  ImageSearchResult,
  DEFAULT_IMAGE_SEARCH_CONFIG,
  validateImageFile,
  generateSearchUrls,
  convertFileToDataUrl,
  getImageDimensions
} from '@/types/image-search';

export interface UseImageSearchReturn {
  state: ImageUploadState;
  handleFileUpload: (file: File) => Promise<void>;
  handleDragDrop: (e: React.DragEvent) => void;
  clearImage: () => void;
  generateSearchUrls: (imageUrl: string) => ImageSearchResult[];
  getAnalysisData: (imageUrl: string) => Promise<ImageAnalysisData>;
}

export const useImageSearch = (): UseImageSearchReturn => {
  const [state, setState] = useState<ImageUploadState>({
    isUploading: false,
    uploadedImage: null,
    uploadError: null,
    isSearching: false
  });

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file, DEFAULT_IMAGE_SEARCH_CONFIG);
    if (!validation.isValid) {
      setState(prev => ({
        ...prev,
        uploadError: validation.error || 'Invalid file',
        isUploading: false
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isUploading: true,
      uploadError: null
    }));

    try {
      // Convert to data URL
      const dataUrl = await convertFileToDataUrl(file);
      
      // Get image dimensions (optional)
      try {
        const dimensions = await getImageDimensions(dataUrl);
        console.log('Image dimensions:', dimensions);
      } catch (error) {
        console.warn('Could not get image dimensions:', error);
      }

      setState(prev => ({
        ...prev,
        isUploading: false,
        uploadedImage: dataUrl,
        uploadError: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isUploading: false,
        uploadError: 'Failed to upload image',
        uploadedImage: null
      }));
    }
  }, []);

  const handleDragDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const clearImage = useCallback(() => {
    setState(prev => ({
      ...prev,
      uploadedImage: null,
      uploadError: null,
      isSearching: false
    }));
  }, []);

  const generateSearchUrlsCallback = useCallback((imageUrl: string): ImageSearchResult[] => {
    return generateSearchUrls(imageUrl, DEFAULT_IMAGE_SEARCH_CONFIG);
  }, []);

  const getAnalysisData = useCallback(async (imageUrl: string): Promise<ImageAnalysisData> => {
    const searchResults = generateSearchUrlsCallback(imageUrl);
    
    // Get file info if available
    let metadata;
    try {
      const dimensions = await getImageDimensions(imageUrl);
      metadata = {
        fileSize: 0, // Would need to be calculated from original file
        fileType: 'image/jpeg', // Would need to be determined from original file
        dimensions
      };
    } catch (error) {
      console.warn('Could not get image metadata:', error);
    }

    return {
      originalImageUrl: imageUrl,
      searchResults,
      analysisDate: new Date().toISOString(),
      metadata
    };
  }, [generateSearchUrlsCallback]);

  return {
    state,
    handleFileUpload,
    handleDragDrop,
    clearImage,
    generateSearchUrls: generateSearchUrlsCallback,
    getAnalysisData
  };
};
