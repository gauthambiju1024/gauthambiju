

## Plan: Fix Hero Image Upload RLS Error

### Root Cause

The storage upload request is being sent with the **anon key** instead of the authenticated user's JWT token. This causes `auth.uid()` to return null, and the storage INSERT policy (`has_role(auth.uid(), 'admin')`) rejects the upload with a 403 error.

This happens because the `ImageUpload` component doesn't verify there's an active session before uploading. If the session token has expired or isn't refreshed, the Supabase client falls back to the anon key.

### Fix

#### `src/components/admin/ImageUpload.tsx`
- Before uploading, call `supabase.auth.getSession()` to ensure a valid session exists
- If no session, show an error toast telling the user to re-login
- This forces a token refresh if the session is stale, ensuring the upload request carries the correct JWT

```typescript
const handleUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);

  // Ensure we have a valid session before uploading
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    toast.error('Session expired. Please log in again.');
    setUploading(false);
    return;
  }

  // ... rest of upload logic
};
```

### Files: 1
1. `src/components/admin/ImageUpload.tsx` — add session check before storage upload

