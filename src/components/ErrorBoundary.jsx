import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Keep this visible in production consoles without crashing the page.
    console.error('Portfolio crashed and was caught by ErrorBoundary:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            padding: '2rem',
            textAlign: 'center',
            background: '#07060f',
            color: '#f4f4f5',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Something went wrong.</h1>
          <p style={{ color: '#a1a1aa', maxWidth: '32rem' }}>
            This page hit an unexpected error. Please try reloading — if the problem continues,
            you can still reach me directly at{' '}
            <a href="mailto:karmakarsuman12138@gmail.com" style={{ color: '#ff5a6e' }}>
              karmakarsuman12138@gmail.com
            </a>
            .
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              padding: '0.7rem 1.4rem',
              borderRadius: '0.6rem',
              border: '2px solid #ff5a6e',
              background: '#ff5a6e',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
