@echo off
REM Trigger all backend bugs to generate errors in the logs

echo Triggering backend bugs...
echo.

echo 1. Getting non-existent user (TypeError: Cannot read properties of undefined)
curl -s http://localhost:3001/api/users/999
echo.
echo.

echo 2. Getting post by ID (TypeError: string vs number comparison)
curl -s http://localhost:3001/api/posts/1
echo.
echo.

echo 3. Sending welcome email (UnhandledPromiseRejection)
curl -s -X POST http://localhost:3001/api/email/send-welcome/1
echo.
echo.

echo Done! Check backend.log for errors.
echo Frontend bugs can be triggered by clicking buttons in the browser at http://localhost:3000
