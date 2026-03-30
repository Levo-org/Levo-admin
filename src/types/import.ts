export interface ImportBatch {
  _id: string;
  batchId: string;
  fileName: string;
  contentType: string;
  targetLanguage?: string;
  status: 'staged' | 'completed' | 'failed' | 'cancelled';
  totalRows: number;
  importedRows: number;
  validRows?: number;
  invalidRows?: number;
  duplicateRows?: number;
  createdAt: string;
  updatedAt: string;
  errors?: ImportError[];
  preview?: ImportPreviewRow[];
}

export interface ImportError {
  row: number;
  data: unknown;
  message: string;
  field?: string;
}

export interface ImportPreviewRow {
  row: number;
  data: unknown;
  status: 'valid' | 'invalid' | 'duplicate';
  errors?: { field?: string; message: string }[];
}

export interface UploadPreviewResponse {
  batchId: string;
  fileName: string;
  contentType: string;
  targetLanguage?: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  preview: ImportPreviewRow[];
}
