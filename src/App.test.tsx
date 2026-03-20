import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App component', () => {
  it('renders without crashing', () => {
    render(<App />);
    const elements = screen.getAllByText(/Levo 관리자 로그인|로딩중/i);
    expect(elements.length).toBeGreaterThan(0);
  });
});
