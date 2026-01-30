import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Report error to backend for logging
    // This mimics production error reporting (like Sentry)
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      }),
    }).catch(err => {
      // If reporting fails, at least log to console
      console.error('Failed to report error:', err);
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#fee', border: '1px solid #c00', margin: '10px', borderRadius: '4px' }}>
          <h2>Something went wrong</h2>
          <p style={{ fontFamily: 'monospace', color: '#c00' }}>
            {this.state.error?.message}
          </p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
