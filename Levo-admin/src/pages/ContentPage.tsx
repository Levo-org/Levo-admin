import React from 'react';
import { useParams } from 'react-router-dom';

export default function ContentPage() {
  const { type } = useParams();
  return (
    <div>
      <h2>Content Management {type ? `- ${type}` : ''}</h2>
      <p>Coming soon...</p>
    </div>
  );
}
