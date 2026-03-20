export type ContentStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'archived';

export interface AuditLog {
  _id: string;
  contentId: string;
  contentType: string;
  action: string;
  previousStatus: ContentStatus;
  newStatus: ContentStatus;
  performedBy: string;
  notes?: string;
  createdAt: string;
}

export interface ContentItem {
  _id: string;
  title?: string;
  word?: string;
  language?: string;
  targetLanguage?: string;
  contentType: string;
  status: ContentStatus;
  submittedBy?: string;
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}
