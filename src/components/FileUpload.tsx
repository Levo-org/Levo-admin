import React, { useRef, useState } from 'react';
import { importService } from '../services/import.service';
import { UploadPreviewResponse } from '../types/import';

interface FileUploadProps {
  onUploadSuccess: (data: UploadPreviewResponse) => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [contentType, setContentType] = useState('vocabulary');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    const validExtensions = ['.csv', '.xlsx'];
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!validTypes.includes(file.type) && !hasValidExtension) {
      setError('CSV 또는 XLSX 파일만 업로드 가능합니다.');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      const response = await importService.uploadFile(file, contentType, targetLanguage);
      if (response.success && response.data) {
        onUploadSuccess(response.data);
      } else {
        setError(response.message || '업로드 중 오류가 발생했습니다.');
      }
    } catch (err) {
      const error = err as Error & { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || error.message || '업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
      <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border)' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--font-lg)' }}>파일 업로드</h3>
      </div>
      
      <div style={{ padding: 'var(--spacing-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label">콘텐츠 유형</label>
            <select 
              className="form-control" 
              value={contentType} 
              onChange={(e) => setContentType(e.target.value)}
              disabled={isUploading}
            >
              <option value="vocabulary">단어 (Vocabulary)</option>
              <option value="grammar">문법 (Grammar)</option>
              <option value="conversation">회화 (Conversation)</option>
              <option value="exampleSentence">예문 (Example Sentence)</option>
            </select>
          </div>
          
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label">학습 언어</label>
            <select 
              className="form-control" 
              value={targetLanguage} 
              onChange={(e) => setTargetLanguage(e.target.value)}
              disabled={isUploading}
            >
              <option value="en">영어 (en)</option>
              <option value="ja">일본어 (ja)</option>
              <option value="zh">중국어 (zh)</option>
            </select>
          </div>
        </div>

        {error && (
          <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-danger)', color: 'white', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-4)' }}>
            {error}
          </div>
        )}

        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-8)',
            textAlign: 'center',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            backgroundColor: isDragging ? 'var(--status-approved-bg)' : 'var(--color-background)',
            transition: 'all 0.2s ease',
            opacity: isUploading ? 0.5 : 1
          }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".csv, .xlsx" 
            style={{ display: 'none' }} 
            disabled={isUploading}
          />
          <div style={{ fontSize: 'var(--font-xl)', marginBottom: 'var(--spacing-2)', color: 'var(--color-text-muted)' }}>
            📄
          </div>
          <p style={{ margin: '0 0 var(--spacing-1) 0', fontWeight: 500 }}>
            {isUploading ? '업로드 중...' : '클릭하거나 파일을 여기로 드래그하세요'}
          </p>
          <p style={{ margin: 0, fontSize: 'var(--font-sm)', color: 'var(--color-text-muted)' }}>
            CSV, XLSX 파일 지원
          </p>
        </div>
      </div>
    </div>
  );
}
