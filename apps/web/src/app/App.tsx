import React from 'react';
import { Project } from '@tidy/shared-types';

export default function App() {
  return (
    <div className="app">
      <h1>Tidy - Project Management</h1>
      <p>Welcome to your new Nx monorepo workspace!</p>
      <div className="test-import">
        <h2>Testing Shared Types Import</h2>
        <pre>
          {JSON.stringify(
            { message: 'Project type imported successfully', type: 'Project' as const },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
