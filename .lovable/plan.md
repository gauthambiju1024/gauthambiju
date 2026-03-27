

## Plan: Remove Admin Login — Open Access Admin Panel

### What changes

**`src/components/admin/AdminLayout.tsx`**
- Remove all auth checks (`useAdminAuth`, `useEffect` redirect, loading state, `!user || !isAdmin` guard)
- Remove the Sign Out button from sidebar
- Remove the user email display — replace with static "Admin Panel" text
- Keep sidebar navigation and layout intact

**`src/App.tsx`**
- Remove the `/admin/login` route and `AdminLogin` import

**`src/pages/admin/AdminLogin.tsx`**
- Delete this file (no longer needed)

**`src/hooks/useAdminAuth.ts`**
- Keep file for now (other admin pages may import it for write operations), but AdminLayout won't use it

### Result
Navigating to `/admin` loads the dashboard directly — no login, no auth check, no loading spinner.

