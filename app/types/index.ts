export type TranslationStatus = 'idle' | 'uploading' | 'extracting' | 'translating' | 'done' | 'error';

export type ImageFile = {
  id: string;
  file: File;
  objectUrl: string;
  name: string;
  width: number;
  height: number;
  uploadedAt: Date;
};

export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ExtractedText = {
  id: string;
  content: string;
  confidence: number;
  boundingBox: BoundingBox;
  language: string | null;
};

export type TranslatedText = {
  id: string;
  sourceTextId: string;
  originalContent: string;
  translatedContent: string;
  targetLanguage: string;
  translatedAt: Date;
};

export type SupportedLanguage = {
  code: string;
  label: string;
};
