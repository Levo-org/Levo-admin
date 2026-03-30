import { useState } from 'react';
import { UploadPreviewResponse } from '../types/import';
import { importService } from '../services/import.service';

interface BatchPreviewProps {
  previewData: UploadPreviewResponse;
  onComplete: () => void;
  onCancel: () => void;
}

export default function BatchPreview({ previewData, onComplete, onCancel }: BatchPreviewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await importService.confirmBatch(previewData.batchId);
      onComplete();
    } catch (err) {
      const error = err as Error & { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || '확정 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    try {
      setIsSubmitting(true);
      await importService.cancelBatch(previewData.batchId);
      onCancel();
    } catch {
      onCancel();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <span className="badge" style={{ backgroundColor: 'var(--status-published-bg)', color: 'var(--status-published-text)' }}>✅ 정상</span>;
      case 'invalid':
        return <span className="badge" style={{ backgroundColor: 'var(--status-archived-bg)', color: 'var(--status-archived-text)' }}>❌ 오류</span>;
      case 'duplicate':
        return <span className="badge" style={{ backgroundColor: 'var(--status-in-review-bg)', color: 'var(--status-in-review-text)' }}>⚠️ 중복</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
      <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--font-lg)' }}>업로드 미리보기: {previewData.fileName}</h3>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <button className="btn btn-secondary" onClick={handleCancel} disabled={isSubmitting}>
            취소
          </button>
          <button className="btn btn-primary" onClick={handleConfirm} disabled={isSubmitting || previewData.validRows === 0}>
            {isSubmitting ? '처리 중...' : '확정'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ margin: 'var(--spacing-4)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-danger)', color: 'white', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      <div style={{ padding: 'var(--spacing-4)', display: 'flex', gap: 'var(--spacing-6)', borderBottom: '1px solid var(--color-border)' }}>
        <div>
          <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-sm)' }}>전체 행</span>
          <div style={{ fontSize: 'var(--font-xl)', fontWeight: 600 }}>{previewData.totalRows}</div>
        </div>
        <div>
          <span style={{ color: 'var(--status-published-text)', fontSize: 'var(--font-sm)' }}>정상</span>
          <div style={{ fontSize: 'var(--font-xl)', fontWeight: 600 }}>{previewData.validRows}</div>
        </div>
        <div>
          <span style={{ color: 'var(--status-archived-text)', fontSize: 'var(--font-sm)' }}>오류</span>
          <div style={{ fontSize: 'var(--font-xl)', fontWeight: 600 }}>{previewData.invalidRows}</div>
        </div>
        <div>
          <span style={{ color: 'var(--status-in-review-text)', fontSize: 'var(--font-sm)' }}>중복</span>
          <div style={{ fontSize: 'var(--font-xl)', fontWeight: 600 }}>{previewData.duplicateRows}</div>
        </div>
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>행 번호</th>
              <th>상태</th>
              <th>데이터 미리보기</th>
              <th>오류 내용</th>
            </tr>
          </thead>
          <tbody>
            {previewData.preview.map((row, idx) => (
              <tr key={idx}>
                <td>{row.row}</td>
                <td>{getStatusBadge(row.status)}</td>
                <td>
                  <pre style={{ margin: 0, fontSize: 'var(--font-xs)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {JSON.stringify(row.data).slice(0, 100)}{JSON.stringify(row.data).length > 100 ? '...' : ''}
                  </pre>
                </td>
                <td>
                  {row.errors && row.errors.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: 'var(--spacing-4)', color: 'var(--color-danger)', fontSize: 'var(--font-sm)' }}>
                      {row.errors.map((e, i) => (
                        <li key={i}>{e.field ? `[${e.field}] ` : ''}{e.message}</li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-sm)' }}>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
