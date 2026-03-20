import { useEffect, useState } from 'react';
import { ImportBatch } from '../types/import';
import { importService } from '../services/import.service';

export default function BatchList() {
  const [batches, setBatches] = useState<ImportBatch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await importService.getBatches({ limit: 20 });
      if (res.success) {
        setBatches(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch batches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'staged': return <span className="badge badge-staged">대기 중</span>;
      case 'completed': return <span className="badge badge-completed">완료</span>;
      case 'failed': return <span className="badge badge-failed">실패</span>;
      case 'cancelled': return <span className="badge badge-cancelled">취소됨</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  const getContentTypeName = (type: string) => {
    const map: Record<string, string> = {
      vocabulary: '단어',
      grammar: '문법',
      conversation: '회화',
      exampleSentence: '예문',
    };
    return map[type] || type;
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="card">
      <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border)' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--font-lg)' }}>최근 가져오기 내역</h3>
      </div>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>파일명</th>
              <th>유형</th>
              <th>상태</th>
              <th>전체 행</th>
              <th>성공</th>
              <th>업로드 일시</th>
            </tr>
          </thead>
          <tbody>
            {batches.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
                  가져오기 내역이 없습니다.
                </td>
              </tr>
            ) : (
              batches.map((batch) => (
                <tr key={batch.batchId} className="tr-clickable">
                  <td style={{ fontWeight: 500 }}>{batch.fileName}</td>
                  <td>{getContentTypeName(batch.contentType)} {batch.targetLanguage ? `(${batch.targetLanguage})` : ''}</td>
                  <td>{getStatusBadge(batch.status)}</td>
                  <td>{batch.totalRows}</td>
                  <td>{batch.importedRows}</td>
                  <td>{new Date(batch.createdAt).toLocaleString('ko-KR')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
