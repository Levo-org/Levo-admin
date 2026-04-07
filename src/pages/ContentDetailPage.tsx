import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { contentService, ContentItem } from '../services/content.service';
import { ContentForm } from '../components/ContentForm';
import { useAuthStore } from '../stores/authStore';

const APP_REQUIRED_FIELDS: Record<string, string[]> = {
  vocabulary: ['word', 'meaning', 'partOfSpeech', 'level', 'chapter'],
  grammar: ['title', 'level', 'explanation', 'formula'],
  conversation: ['title', 'level', 'dialogs'],
  exampleSentence: ['originalText', 'translation', 'level'],
  listening: ['audioText', 'correctAnswer', 'difficulty'],
  reading: ['title', 'content', 'difficulty', 'quizzes'],
};

const isBlank = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
};

const findMissingAppFields = (contentType: string, data: Partial<ContentItem>): string[] => {
  const requiredFields = APP_REQUIRED_FIELDS[contentType] ?? [];

  return requiredFields.filter((field) => {
    if (field === 'originalText') {
      return isBlank(data.originalText) && isBlank(data.text);
    }

    if (field === 'difficulty') {
      return isBlank(data.difficulty) && isBlank(data.level);
    }

    const value = data[field as keyof ContentItem];
    return isBlank(value);
  });
};

const buildAppPreview = (contentType: string, data: Partial<ContentItem>): Record<string, unknown> => {
  if (contentType === 'vocabulary') {
    return {
      _id: data._id,
      word: data.word || '',
      pronunciation: data.pronunciation || '',
      meaning: data.meaning || '',
      meanings: data.meanings || [],
      meaningExamples: data.meaningExamples || [],
      partOfSpeech: data.partOfSpeech || '',
      exampleSentence: data.exampleSentence || '',
      exampleTranslation: data.exampleTranslation || '',
      audioUrl: data.audioUrl || '',
      level: data.level || 'beginner',
      chapter: data.chapter,
    };
  }

  if (contentType === 'grammar') {
    return {
      _id: data._id,
      title: data.title || '',
      level: data.level || 'beginner',
      explanation: data.explanation || '',
      formula: data.formula || '',
      formulaDesc: data.formulaExample || '',
      examples: (data.examples || []).map((item) => ({
        sentence: item.sentence || item.text || '',
        translation: item.translation || '',
      })),
      questions: (data.quizzes || []).map((quiz) => ({
        question: quiz.question,
        options: quiz.options,
        correctIndex: quiz.correctAnswer,
      })),
    };
  }

  if (contentType === 'conversation') {
    const dialogs = (data.dialogs || []).map((dialog) => ({
      speaker: dialog.speaker,
      text: dialog.text,
      translation: dialog.translation,
      isUserRole: Boolean(dialog.isUserRole),
      isUser: Boolean(dialog.isUserRole),
    }));

    return {
      _id: data._id,
      emoji: data.icon || '💬',
      title: data.title || '',
      level: data.level || 'beginner',
      description: '',
      dialogs,
      dialog: dialogs,
      keyExpressions: data.keyExpressions || [],
    };
  }

  if (contentType === 'exampleSentence') {
    return {
      _id: data._id,
      originalText: data.originalText || data.text || '',
      translation: data.translation || '',
      topic: data.topic || '',
      level: data.level || 'beginner',
    };
  }

  if (contentType === 'listening') {
    return {
      _id: data._id,
      question: 'Choose what you heard.',
      options: data.correctAnswer ? [data.correctAnswer] : [],
      ttsText: data.audioText || data.correctAnswer || '',
      difficulty: data.difficulty || data.level || 'beginner',
      audioUrl: null,
      answerForValidation: data.correctAnswer || '',
    };
  }

  if (contentType === 'reading') {
    return {
      _id: data._id,
      title: data.title || '',
      text: data.content || '',
      translation: data.translation || '',
      difficulty: data.difficulty || data.level || 'beginner',
      questions: (data.quizzes || []).map((quiz) => ({
        question: quiz.question,
        options: quiz.options,
        correctIndex: quiz.correctAnswer,
      })),
    };
  }

  return data;
};

export default function ContentDetailPage() {
  const { contentType, id } = useParams<{ contentType: string; id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isNew = id === 'new';
  const canDelete = user?.role === 'admin' && !isNew;
  
  const [data, setData] = useState<Partial<ContentItem> | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const appVisiblePreview = useMemo(() => {
    if (!data || !contentType) return null;
    return buildAppPreview(contentType, data);
  }, [data, contentType]);

  const missingAppFields = useMemo(() => {
    if (!data || !contentType) return [];
    return findMissingAppFields(contentType, data);
  }, [data, contentType]);

  const createInitialData = (type?: string): Partial<ContentItem> => {
    if (type === 'listening' || type === 'reading') {
      return { status: 'draft', targetLanguage: 'en', difficulty: 'beginner' };
    }

    return { status: 'draft', targetLanguage: 'en', level: 'beginner' };
  };

  useEffect(() => {
    if (isNew) {
      setData(createInitialData(contentType));
      setLoading(false);
      return;
    }
    
    if (contentType && id) {
      loadData(contentType, id);
    }
  }, [contentType, id, isNew]);

  const loadData = async (type: string, contentId: string) => {
    try {
      setLoading(true);
      const res = await contentService.getDetail(type, contentId);
      setData(res.data);
    } catch (err: unknown) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: Partial<ContentItem>) => {
    if (!contentType) return;
    
    try {
      if (isNew) {
        await contentService.create(contentType, formData);
        navigate(`/content/${contentType}`);
      } else if (id) {
        await contentService.update(contentType, id, formData);
        alert('저장되었습니다.');
        loadData(contentType, id);
      }
    } catch (err: unknown) {
      setError('저장 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!canDelete || !contentType || !id) return;

    const confirmed = window.confirm('이 콘텐츠를 삭제(보관 처리)하시겠습니까?');
    if (!confirmed) return;

    try {
      setDeleting(true);
      await contentService.delete(contentType, id);
      navigate(`/content/${contentType}`);
    } catch (err: unknown) {
      setError('삭제 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div style={{ padding: 'var(--spacing-6)' }}>로딩 중...</div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">{isNew ? '새 콘텐츠' : '콘텐츠 상세 / 수정'}</h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          {canDelete && (
            <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? '삭제 중...' : '삭제'}
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => navigate(`/content/${contentType}`)}>
            목록으로
          </button>
        </div>
      </div>

      {error && <div style={{ color: 'var(--color-danger)', marginBottom: 'var(--spacing-4)' }}>{error}</div>}

      {data && (
        <>
          <ContentForm
            key={`${contentType}-${id}`}
            initialData={data}
            contentType={contentType || 'vocabulary'}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/content/${contentType}`)}
          />

          <div className="card" style={{ marginTop: 'var(--spacing-4)', padding: 'var(--spacing-6)' }}>
            <h3 style={{ marginTop: 0, marginBottom: 'var(--spacing-3)' }}>앱 노출 데이터 미리보기</h3>
            <p style={{ marginTop: 0, marginBottom: 'var(--spacing-3)', color: 'var(--color-text-muted)' }}>
              앱에서 사용하는 응답 형태 기준으로 렌더링한 값입니다.
            </p>
            {missingAppFields.length > 0 && (
              <div style={{ color: 'var(--color-danger)', marginBottom: 'var(--spacing-3)', fontWeight: 500 }}>
                앱 노출 필수값 누락: {missingAppFields.join(', ')}
              </div>
            )}
            <pre
              style={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: '0.875rem',
                lineHeight: 1.5,
                background: '#111827',
                color: '#E5E7EB',
                padding: '1rem',
                borderRadius: '0.5rem',
              }}
            >
              {JSON.stringify(appVisiblePreview, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}
