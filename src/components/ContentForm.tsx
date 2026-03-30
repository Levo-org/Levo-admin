import React, { useState } from 'react';
import { ContentItem, DIFFICULTY_OPTIONS } from '../services/content.service';

interface ContentFormProps {
  initialData?: Partial<ContentItem>;
  contentType: string;
  onSubmit: (data: Partial<ContentItem>) => void;
  onCancel: () => void;
}

export const ContentForm: React.FC<ContentFormProps> = ({ initialData, contentType, onSubmit, onCancel }) => {
  const difficultyFieldName = contentType === 'listening' || contentType === 'reading' ? 'difficulty' : 'level';
  const createDefaultFormData = (): Partial<ContentItem> => ({
    status: 'draft',
    targetLanguage: 'en',
    [difficultyFieldName]: 'beginner',
  });

  const [formData, setFormData] = useState<Partial<ContentItem>>(initialData || createDefaultFormData());
  const selectedDifficulty = (difficultyFieldName === 'difficulty' ? formData.difficulty : formData.level) || 'beginner';

  const isPublished = formData.status === 'published';
  const isReadOnly = isPublished;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">상태</label>
          <select
            name="status"
            value={formData.status || 'draft'}
            onChange={handleChange}
            className="form-control"
            disabled={isReadOnly}
          >
            <option value="draft">초안</option>
            <option value="in_review">검토중</option>
            <option value="approved">승인됨</option>
            <option value="published">게시됨</option>
            <option value="archived">보관됨</option>
          </select>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">언어</label>
          <select
            name="targetLanguage"
            value={formData.targetLanguage || 'en'}
            onChange={handleChange}
            className="form-control"
            disabled={isReadOnly}
          >
            <option value="ko">한국어</option>
            <option value="en">영어</option>
            <option value="ja">일본어</option>
            <option value="es">스페인어</option>
          </select>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">난이도</label>
          <select
            name={difficultyFieldName}
            value={selectedDifficulty}
            onChange={handleChange}
            className="form-control"
            disabled={isReadOnly}
          >
            {DIFFICULTY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">토픽</label>
        <input
          type="text"
          name="topic"
          value={formData.topic || ''}
          onChange={handleChange}
          className="form-control"
          disabled={isReadOnly}
        />
      </div>

      {contentType === 'vocabulary' && (
        <>
          <div className="form-group">
            <label className="form-label">챕터</label>
            <input
              type="number"
              name="chapter"
              min={1}
              value={formData.chapter ?? ''}
              onChange={handleChange}
              className="form-control"
              required
              disabled={isReadOnly}
            />
          </div>
          <div className="form-group">
            <label className="form-label">단어 (Word)</label>
            <input type="text" name="word" value={formData.word || ''} onChange={handleChange} className="form-control" required disabled={isReadOnly} />
          </div>
          <div className="form-group">
            <label className="form-label">의미 (Meaning)</label>
            <input type="text" name="meaning" value={formData.meaning || ''} onChange={handleChange} className="form-control" required disabled={isReadOnly} />
          </div>
          <div className="form-group">
            <label className="form-label">품사</label>
            <input type="text" name="partOfSpeech" value={formData.partOfSpeech || ''} onChange={handleChange} className="form-control" required disabled={isReadOnly} />
          </div>
        </>
      )}

      {contentType === 'grammar' && (
        <>
          <div className="form-group">
            <label className="form-label">제목 (Title)</label>
            <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className="form-control" required disabled={isReadOnly} />
          </div>
          <div className="form-group">
            <label className="form-label">설명 (Explanation)</label>
            <textarea name="explanation" value={formData.explanation || ''} onChange={handleChange} className="form-control" rows={4} disabled={isReadOnly} />
          </div>
        </>
      )}

      {contentType === 'conversation' && (
        <>
          <div className="form-group">
            <label className="form-label">제목 (Title)</label>
            <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className="form-control" required disabled={isReadOnly} />
          </div>
        </>
      )}

      {contentType === 'exampleSentence' && (
        <>
          <div className="form-group">
            <label className="form-label">문장 (Original Text)</label>
            <textarea
              name="originalText"
              value={formData.originalText || formData.text || ''}
              onChange={handleChange}
              className="form-control"
              rows={3}
              required
              disabled={isReadOnly}
            />
          </div>
          <div className="form-group">
            <label className="form-label">번역 (Translation)</label>
            <textarea name="translation" value={formData.translation || ''} onChange={handleChange} className="form-control" rows={3} disabled={isReadOnly} />
          </div>
        </>
      )}

      {contentType === 'listening' && (
        <>
          <div className="form-group">
            <label className="form-label">오디오 텍스트</label>
            <textarea
              name="audioText"
              value={formData.audioText || ''}
              onChange={handleChange}
              className="form-control"
              rows={3}
              required
              disabled={isReadOnly}
            />
          </div>
          <div className="form-group">
            <label className="form-label">정답</label>
            <input
              type="text"
              name="correctAnswer"
              value={formData.correctAnswer || ''}
              onChange={handleChange}
              className="form-control"
              required
              disabled={isReadOnly}
            />
          </div>
          <div className="form-group">
            <label className="form-label">힌트</label>
            <input
              type="text"
              name="hint"
              value={formData.hint || ''}
              onChange={handleChange}
              className="form-control"
              disabled={isReadOnly}
            />
          </div>
        </>
      )}

      {contentType === 'reading' && (
        <>
          <div className="form-group">
            <label className="form-label">제목 (Title)</label>
            <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className="form-control" required disabled={isReadOnly} />
          </div>
          <div className="form-group">
            <label className="form-label">본문 (Content)</label>
            <textarea
              name="content"
              value={formData.content || ''}
              onChange={handleChange}
              className="form-control"
              rows={6}
              required
              disabled={isReadOnly}
            />
          </div>
          <div className="form-group">
            <label className="form-label">번역 (Translation)</label>
            <textarea
              name="translation"
              value={formData.translation || ''}
              onChange={handleChange}
              className="form-control"
              rows={4}
              disabled={isReadOnly}
            />
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-8)' }}>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          취소 / 목록으로
        </button>
        {!isReadOnly && (
          <button type="submit" className="btn btn-primary" style={{ marginLeft: 'auto' }}>
            저장
          </button>
        )}
      </div>
    </form>
  );
};
