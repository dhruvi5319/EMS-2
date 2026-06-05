# Screen-00: Login / Authentication

**Purpose:** Authenticate user; enforce account lockout; redirect to Portfolio Dashboard  
**User Stories:** US-0.1, US-0.2  
**Personas:** All roles  
**Journeys:** All (entry point)

---

## Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    [EMS Logo / Wordmark]                        │
│               Engagement Management System                      │
│                                                                 │
│         ┌───────────────────────────────────────┐              │
│         │         Sign in to your account       │              │
│         │                                       │              │
│         │  Username (email)                     │              │
│         │  ┌───────────────────────────────┐    │              │
│         │  │ email@agency.gov              │    │              │
│         │  └───────────────────────────────┘    │              │
│         │                                       │              │
│         │  Password                             │              │
│         │  ┌───────────────────────────────┐    │              │
│         │  │ ••••••••••••••                │    │              │
│         │  └───────────────────────────────┘    │              │
│         │                              [👁 Show] │              │
│         │                                       │              │
│         │  ┌───────────────────────────────┐    │              │
│         │  │          Sign In              │    │              │
│         │  └───────────────────────────────┘    │              │
│         │                                       │              │
│         │  [Error state area — hidden by default│              │
│         │   shows message when auth fails]      │              │
│         │                                       │              │
│         └───────────────────────────────────────┘              │
│                                                                 │
│              © 2026 Engagement Management System                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Username + Password fields | Center card |
| Primary | Sign In button | Below fields, full width |
| Secondary | Error message | Below button, inside card |
| Tertiary | Branding | Above card |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Empty form fields, Sign In active | — |
| Typing | Field border highlights | Real-time: none (no partial validation) |
| Loading | Sign In button: spinner + "Signing in..." disabled | "Signing in..." |
| Invalid credentials | Red error banner below button | "Invalid username or password." (generic — no field disclosure) |
| Account locked | Red error banner | "Account locked due to repeated failures. Try again in 15 minutes." |
| Missing fields | Sign In triggers inline errors per field | "Username is required" / "Password is required" |
| Success | Redirects to /dashboard | — |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Username field | Email text input | Auto-focus on load; Enter → move to Password |
| Password field | Password input | Show/hide toggle; Enter → submit |
| Show password toggle | Icon button | Toggles input type password ↔ text |
| Sign In button | Primary CTA | Submits form; disabled during loading state |
| Error message | Alert (role="alert") | Screen-reader announced; appears below button |

---

## Error Messages

| Scenario | Message |
|----------|---------|
| Invalid credentials | "Invalid username or password." |
| Account locked | "Account locked due to repeated failures. Try again in 15 minutes." |
| Missing username | Field error: "Username is required." |
| Missing password | Field error: "Password is required." |

**Error message design:** Generic invalid-credentials message (no field disclosure — do not reveal which field is wrong). Error appears in a red alert box, not as a toast.

---
