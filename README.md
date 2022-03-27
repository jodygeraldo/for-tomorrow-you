# For Tomorrow You

Just another note app

## Tech

- [Remix](http://remix.run/)
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)

## What it's include

- Sign in with magic link powered by [supabase](https://supabase.com/)
- Add note for 24 hours
- Delete note
- Finish note, will throw the note to logs (if 24 hours is gone the note is also thrown to logs)

### Magic Link

I'm quiet happy with the magic link implementation here.

Here related links:
- [.env](https://github.com/jodygeraldo/for-tomorrow-you/blob/main/.env.example)
- [Supabase client](https://github.com/jodygeraldo/for-tomorrow-you/blob/main/app/utils/supabase.server.ts)
- [Cookies and helper functions](https://github.com/jodygeraldo/for-tomorrow-you/blob/main/app/utils/auth.server.ts)
- [The login route](https://github.com/jodygeraldo/for-tomorrow-you/blob/main/app/routes/login.tsx)
- [The callback route](https://github.com/jodygeraldo/for-tomorrow-you/blob/main/app/routes/callback.tsx)
- [The logout route](https://github.com/jodygeraldo/for-tomorrow-you/blob/main/app/routes/logout.tsx)
- [Refresh access_token](https://github.com/jodygeraldo/for-tomorrow-you/blob/2b9c88cf2dd259f482c7fef4a701952dcf73ed0f/app/routes/__app.tsx#L8)
