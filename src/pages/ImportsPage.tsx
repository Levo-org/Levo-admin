import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import BatchPreview from '../components/BatchPreview';
import BatchList from '../components/BatchList';
import { UploadPreviewResponse } from '../types/import';

export default function ImportsPage() {
  const [previewData, setPreviewData] = useState<UploadPreviewResponse | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = (data: UploadPreviewResponse) => {
    setPreviewData(data);
  };

  const handleComplete = () => {
    setPreviewData(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCancel = () => {
    setPreviewData(null);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">콘텐츠 가져오기</h1>
      </div>

      {!previewData ? (
        <>
          <FileUpload onUploadSuccess={handleUploadSuccess} />
          <BatchList key={refreshKey} />
        </>
      ) : (
        <BatchPreview 
          previewData={previewData} 
          onComplete={handleComplete} 
          onCancel={handleCancel} 
        />
      )}
    </div>
  );
}
