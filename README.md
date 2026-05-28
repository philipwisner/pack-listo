This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Local Development with Supabase

This app uses Supabase for authentication and PostgreSQL for the database. For local development, you can run Supabase locally using the Supabase CLI.

### Prerequisites

Install the Supabase CLI:

```bash
brew install supabase/tap/supabase
```

Verify installation:

```bash
supabase --version
```

### Starting Local Supabase

1. **Initialize Supabase** (one-time setup):

```bash
supabase init
```

2. **Start the local Supabase stack** (Docker required):

```bash
supabase start
```

This will output your local credentials. Copy these into `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key-from-supabase-start>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key-from-supabase-start>
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
```

3. **Push Prisma schema to the local database**:

```bash
npx prisma db push
npx prisma generate
```

4. **Start the Next.js dev server**:

```bash
npm run dev
```

5. **Test the app**:

- Open http://localhost:3000
- Go to /signup and create a user
- User should appear in both Supabase Auth and the PostgreSQL database

### Stopping Local Supabase

```bash
supabase stop
```

### Password Reset Helper

This repo includes a helper script to reset any Supabase auth user's password by email.
It uses the local `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` and calls the Supabase admin API.

Run it like this:

```bash
npm run reset-password -- user@example.com
```

You will be prompted to enter and confirm a new password. It works for any existing auth user, not just the admin user.

### Deployment to Hosted Supabase

When deploying to production, set these environment variables on your hosting platform (e.g., Vercel) with your hosted Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_hosted_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_hosted_service_role_key
DATABASE_URL=postgresql://postgres:...@db.your-project.supabase.co:5432/postgres
```

The same code works for both local and hosted—only environment variables differ.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
