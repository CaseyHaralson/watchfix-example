import { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import UserList from './components/UserList';
import Counter from './components/Counter';
import Dashboard from './components/Dashboard';

function App() {
  const [showUserList, setShowUserList] = useState(false);
  const [showCounter, setShowCounter] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const triggerBackendBug = async (endpoint, description) => {
    setApiResponse({ loading: true, endpoint });
    try {
      const res = await fetch(endpoint, { 
        method: endpoint.includes('send-welcome') ? 'POST' : 'GET' 
      });
      const data = await res.json();
      setApiResponse({ 
        success: res.ok, 
        status: res.status, 
        data, 
        endpoint,
        description 
      });
    } catch (err) {
      setApiResponse({ 
        success: false, 
        error: err.message, 
        endpoint,
        description 
      });
    }
  };

  return (
    <div className="app">
      <header>
        <h1>🔧 Watchfix Example App</h1>
        <p>Click buttons below to trigger intentional bugs. Watch the logs and see watchfix detect and fix them!</p>
      </header>

      <main>
        <section className="bug-section">
          <h2>Backend Bugs</h2>
          <p className="section-description">These buttons call API endpoints that have bugs in the backend code.</p>
          
          <div className="button-group">
            <button onClick={() => triggerBackendBug('/api/users/999', 'TypeError: Cannot read properties of undefined')}>
              👤 Get Non-existent User
              <span className="bug-hint">TypeError - no null check</span>
            </button>
            
            <button onClick={() => triggerBackendBug('/api/posts/1', 'TypeError: string vs number comparison')}>
              📝 Get Post by ID
              <span className="bug-hint">TypeError - string !== number</span>
            </button>
            
            <button onClick={() => triggerBackendBug('/api/email/send-welcome/1', 'UnhandledPromiseRejection')}>
              ✉️ Send Welcome Email
              <span className="bug-hint">Unhandled promise rejection</span>
            </button>
          </div>

          {apiResponse && (
            <div className={`api-response ${apiResponse.success ? 'success' : 'error'}`}>
              <strong>{apiResponse.endpoint}</strong>
              {apiResponse.loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <p>Status: {apiResponse.status || 'Error'}</p>
                  <pre>{JSON.stringify(apiResponse.data || apiResponse.error, null, 2)}</pre>
                  {!apiResponse.success && (
                    <p className="expected-error">Expected: {apiResponse.description}</p>
                  )}
                </>
              )}
            </div>
          )}
        </section>

        <section className="bug-section">
          <h2>Frontend Bugs</h2>
          <p className="section-description">These buttons render components that have bugs. Errors are caught and reported to the backend.</p>
          
          <div className="button-group">
            <button onClick={() => setShowUserList(!showUserList)}>
              📋 {showUserList ? 'Hide' : 'Show'} User List
              <span className="bug-hint">TypeError - undefined.map()</span>
            </button>
            
            <button onClick={() => setShowCounter(!showCounter)}>
              🔢 {showCounter ? 'Hide' : 'Show'} Counter
              <span className="bug-hint">ReferenceError - typo in variable</span>
            </button>
            
            <button onClick={() => setShowDashboard(!showDashboard)}>
              📊 {showDashboard ? 'Hide' : 'Show'} Dashboard
              <span className="bug-hint">ReferenceError - missing import</span>
            </button>
          </div>

          <div className="component-display">
            {showUserList && (
              <ErrorBoundary>
                {/* BUG: Passing undefined instead of an array */}
                <UserList users={undefined} />
              </ErrorBoundary>
            )}
            
            {showCounter && (
              <ErrorBoundary>
                <Counter />
              </ErrorBoundary>
            )}
            
            {showDashboard && (
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            )}
          </div>
        </section>
      </main>

      <footer>
        <p>
          Check your terminal running <code>watchfix watch</code> to see errors being detected.
          <br />
          Errors are logged to <code>backend.log</code> and <code>frontend.log</code>.
        </p>
      </footer>
    </div>
  );
}

export default App;
