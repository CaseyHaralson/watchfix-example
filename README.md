# Watchfix Example Project

A demo project with intentional bugs to showcase [watchfix](https://github.com/CaseyHaralson/watchfix) - an AI-powered error detection and fixing tool.

This project contains a React frontend and Express backend, each with several bugs that produce detectable errors in the logs. Use this to see how watchfix monitors logs, detects errors, and automatically fixes them.

## Prerequisites

- **Node.js 18+**
- **One of the following AI coding agents:**
  - [Claude Code CLI](https://github.com/anthropics/claude-code) (`claude` command)
  - [Gemini CLI](https://github.com/google-gemini/gemini-cli) (`gemini` command)
  - [OpenAI Codex CLI](https://github.com/openai/codex) (`codex` command)
- **watchfix** installed globally or via npx

## Quick Start

### 1. Install dependencies

```bash
# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Start the backend (Terminal 1)

The backend runs on port 3001.

**Linux/macOS:**
```bash
cd backend && FORCE_COLOR=1 npm run dev 2>&1 | tee ../backend.log
```

**Windows (PowerShell):**
```powershell
cd backend
npm run dev 2>&1 | Tee-Object -FilePath ../backend.log
```

### 3. Start the frontend (Terminal 2)

The frontend runs on port 3000 and proxies API requests to the backend.

**Linux/macOS:**
```bash
cd frontend && FORCE_COLOR=1 npm run dev 2>&1 | tee ../frontend.log
```

**Windows (PowerShell):**
```powershell
cd frontend
npm run dev 2>&1 | Tee-Object -FilePath ../frontend.log
```

### 4. Start watchfix (Terminal 3)

```bash
# From the project root directory
watchfix watch
```

Or to enable automatic fixing without approval:
```bash
watchfix watch --autonomous
```

### 5. Trigger bugs!

Open http://localhost:3000 in your browser. You'll see buttons that trigger various bugs:

**Backend bugs** (API calls):
- 👤 Get Non-existent User
- 📝 Get Post by ID
- ✉️ Send Welcome Email

**Frontend bugs** (component rendering):
- 📋 Show User List
- 🔢 Show Counter
- 📊 Show Dashboard

Alternatively, trigger backend bugs from the command line:

**Linux/macOS:**
```bash
./trigger-bugs.sh
```

**Windows:**
```cmd
trigger-bugs.bat
```

### 6. Watch the magic happen

In Terminal 3, you'll see watchfix:
1. Detect errors as they appear in the logs

and if autonomous mode is turned on...

2. Analyze the error and identify the root cause
3. Generate and apply a fix
4. Run tests to verify the fix worked

Read [further below](#try-manual-mode-first) on how to fix errors in "manual mode". 

### 7. See what changed

```bash
git diff
```

## Project Structure

```
watchfix-example/
├── backend/
│   ├── src/
│   │   ├── server.js          # Express server + error logging endpoint
│   │   ├── routes/
│   │   │   ├── users.js
│   │   │   ├── posts.js
│   │   │   └── email.js
│   │   └── data/
│   │       └── store.js       # In-memory data (no DB required)
│   ├── tests/                 # Tests that fail until bugs are fixed
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main app with bug trigger buttons
│   │   ├── main.jsx           # Entry point with ErrorBoundary
│   │   ├── components/
│   │   │   ├── ErrorBoundary.jsx  # Catches errors, reports to backend
│   │   │   ├── UserList.jsx
│   │   │   ├── Counter.jsx
│   │   │   └── Dashboard.jsx
│   │   └── index.css
│   ├── tests/                 # Tests that fail until bugs are fixed
│   └── package.json
├── watchfix.yaml              # Watchfix configuration
├── backend.log                # Created when backend runs with tee
├── frontend.log               # Created when frontend runs with tee
├── trigger-bugs.sh            # Script to trigger backend bugs (Linux/macOS)
├── trigger-bugs.bat           # Script to trigger backend bugs (Windows)
└── README.md
```

## How Frontend Errors Reach the Logs

Frontend runtime errors don't naturally appear in the terminal. This project uses a pattern common in production apps:

1. An `ErrorBoundary` component catches React errors
2. It POSTs the error details to `/api/log-error` on the backend
3. The backend logs the error to stdout
4. The error appears in `backend.log` (via tee)

This mimics how production error reporting works (think Sentry, LogRocket, etc.).

## Configuration

The `watchfix.yaml` file configures watchfix for this project:

```yaml
sources:
  - type: file
    path: ./backend.log
  - type: file
    path: ./frontend.log

agent:
  provider: claude  # or: gemini, codex

verification:
  test_commands:
    - cd backend && npm test
    - cd frontend && npm test
```

## Tips

### Try Manual Mode First

To understand the workflow, try manual mode before autonomous:

```bash
# Start watching (detection only)
watchfix watch

# In another terminal, trigger a bug
curl http://localhost:3001/api/users/999

# See pending errors
watchfix status

# View error details
watchfix show 1

# Fix a specific error
watchfix fix 1
```

### Reset to Buggy State

To reset and try again:

```bash
git checkout -- backend/src frontend/src
```

### Change AI Agent

Edit `watchfix.yaml` to use a different agent:

```yaml
agent:
  provider: gemini  # or: claude, codex
```

## Troubleshooting

### Logs not being created

Make sure you're using `tee` (or `Tee-Object` on PowerShell) to pipe output to the log file while still seeing it in the terminal.

### watchfix not detecting errors

1. Check that log files exist: `ls -la *.log`
2. Verify watchfix.yaml paths are correct
3. Run `watchfix config validate`

### Frontend errors not appearing in logs

1. Make sure the backend is running (frontend POSTs errors to it)
2. Check browser console for network errors
3. Verify the ErrorBoundary is wrapping components

### Tests still failing after fix

The AI might have applied a partial fix. Check `watchfix show <id>` for details and try `watchfix fix <id>` again, or manually review the changes.

## License

MIT - Use this example project however you like!
