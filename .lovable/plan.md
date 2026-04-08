

## Plan: Add Login to Admin Panel for Authenticated Actions

The admin panel currently has no login UI (auth guards were previously removed for open access). However, storage uploads require an authenticated session due to RLS policies. When the session expires or doesn't exist, there's no way to sign back in.

### Solution

Add a lightweight login form that appears only when an upload fails due to missing session, plus a persistent sign-in option in the admin sidebar.

### Changes

#### 1. `src/components/admin/AdminLayout.tsx`
- Import `useAdminAuth` hook
- Add a sign-in/sign-out button in the sidebar footer showing current auth state
- When not signed in, show a compact login form (email + password) inline in the sidebar
- When signed in, show user email and a sign-out button

#### 2. `src/components/admin/ImageUpload.tsx`
- When session check fails, instead of just showing a toast, show a more helpful message directing the user to sign in via the sidebar

### Files: 2
1. `src/components/admin/AdminLayout.tsx` — add auth state display and login form in sidebar
2. `src/components/admin/ImageUpload.tsx` — improve error message

