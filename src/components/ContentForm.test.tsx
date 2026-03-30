import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ContentForm } from './ContentForm';

describe('ContentForm', () => {
  it('uses difficulty field for reading content', () => {
    const handleSubmit = vi.fn();

    render(
      <ContentForm
        contentType="reading"
        initialData={{
          status: 'draft',
          targetLanguage: 'en',
          difficulty: 'intermediate',
          title: 'Reading title',
          content: 'Reading content',
        }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByDisplayValue('중급'), {
      target: { name: 'difficulty', value: 'advanced' },
    });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        difficulty: 'advanced',
      }),
    );

    expect(handleSubmit).not.toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'advanced',
      }),
    );
  });

  it('uses level field for vocabulary content', () => {
    const handleSubmit = vi.fn();

    render(
      <ContentForm
        contentType="vocabulary"
        initialData={{
          status: 'draft',
          targetLanguage: 'en',
          level: 'elementary',
          chapter: 1,
          word: 'word',
          meaning: 'meaning',
          partOfSpeech: 'noun',
        }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByDisplayValue('초급'), {
      target: { name: 'level', value: 'advanced' },
    });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'advanced',
      }),
    );
  });
});
