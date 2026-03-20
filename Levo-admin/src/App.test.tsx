import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  it('renders without crashing', () => {
    render(<App />);
    const elements = screen.getAllByText(/Levo Admin|Loading|Login/i);
    expect(elements.length).toBeGreaterThan(0);
  });
});
