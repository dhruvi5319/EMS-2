---
status: complete
phase: 01-foundation
source: 01-01-SUMMARY.md, 01-02-SUMMARY.md, 01-03-SUMMARY.md, 01-04-SUMMARY.md
started: 2026-06-05T18:56:51Z
updated: 2026-06-05T19:10:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Stack Startup
expected: Run `docker compose up` from the project root. All 4 services start without errors: postgres, minio, backend (port 3001), and frontend (port 5173). The backend health endpoint at http://localhost:3001/health returns {"status":"ok"}.
result: pass

### 2. Login Page Renders
expected: Navigate to http://localhost:5173. You see the EMS login page with a username field, password field, show/hide password toggle, and a login button. The username field is auto-focused.
result: pass

### 3. Login with Valid Credentials
expected: On the login page, enter username `admin` and password `Admin1234!` then submit. You are redirected to the dashboard. The sidebar and topbar are visible.
result: pass

### 4. Session Persists on Reload
expected: After logging in as admin, refresh the page (F5 or Cmd+R). You remain on the dashboard — you are NOT redirected back to the login page.
result: pass

### 5. App Shell Layout
expected: While logged in, the app shell shows: a 220px left sidebar with 5 nav items (Dashboard, Requests, Engagements, Review Queue, Reports) and a 64px topbar showing your user initials/display name and a Log Out button.
result: pass

### 6. Active Nav State
expected: The current page's nav item in the sidebar shows a visual active state (different color or accent indicator) compared to the other nav items.
result: pass

### 7. Logout
expected: Click the Log Out button in the topbar. You are redirected to the login page and can no longer access protected routes (navigating to /dashboard redirects back to login).
result: pass

### 8. Invalid Credentials Error
expected: On the login page, enter a wrong username or wrong password and submit. An error message appears — it does NOT distinguish between "user not found" and "wrong password" (generic 401 message for both).
result: pass

### 9. Account Lockout
expected: On the login page, enter the correct username but wrong password 5 times in a row. On the 5th attempt (or after), you see a lockout message (account locked, try again later) instead of the generic invalid credentials error.
result: pass

### 10. Empty Field Validation
expected: On the login page, click the login button without entering any credentials. Field-level validation errors appear (e.g., "Username is required", "Password is required") — the form does not submit.
result: pass

## Summary

total: 10
passed: 10
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
