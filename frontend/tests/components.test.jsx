import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ErrorBoundary from '../src/components/ErrorBoundary';
import App from '../src/App';

// Mock fetch globally to prevent network errors in tests
const mockFetch = vi.fn(() => Promise.resolve({ ok: true }));

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
  mockFetch.mockClear();
});

describe('ErrorBoundary', () => {
  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test content')).toBeDefined();
  });

  it('should catch errors and display fallback UI', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeDefined();
    consoleSpy.mockRestore();
  });
});

describe('App', () => {
  it('should render the main heading', () => {
    render(<App />);
    expect(screen.getByText(/Watchfix Example App/)).toBeDefined();
  });

  it('should render backend bug buttons', () => {
    render(<App />);
    expect(screen.getByText(/Get Non-existent User/)).toBeDefined();
    expect(screen.getByText(/Get Post by ID/)).toBeDefined();
    expect(screen.getByText(/Send Welcome Email/)).toBeDefined();
  });

  it('should render frontend bug buttons', () => {
    render(<App />);
    expect(screen.getByText(/Show User List/)).toBeDefined();
    expect(screen.getByText(/Show Counter/)).toBeDefined();
    expect(screen.getByText(/Show Dashboard/)).toBeDefined();
  });

  it('should not render buggy components by default', () => {
    render(<App />);
    // The buggy components should be hidden until buttons are clicked
    expect(screen.queryByText('User List')).toBeNull();
    expect(screen.queryByText('Counter')).toBeNull();
    expect(screen.queryByText('Dashboard')).toBeNull();
  });
});
