# Universal Library

A full-stack library management app for discovering books, requesting loans, tracking copy availability, and managing account and borrowing approvals.

**Live demo:** https://universal-library-tau-wine.vercel.app

## Features

### Readers
- Browse and search the book catalog.
- Create an account and sign in with email and password.
- View account status and borrowing activity.
- Request a book and track the request.
- Submit or update a review after an approved borrow.

### Library administrators
- Approve or reject new accounts.
- Create and update book records, including covers and media details.
- Review borrowing requests and approve or reject them.
- Mark active loans as returned.
- Track available copies and view library activity summaries.

### Background services
- PostgreSQL persistence through Neon and Drizzle ORM.
- Email notifications and onboarding/re-engagement workflows using EmailJS and Upstash Workflow.
- Upstash Redis rate limiting for sign-in and sign-up attempts.
- ImageKit uploads for book covers.

## Tech stack

| Area | Technology |
| --- | --- |
| Application | Next.js 14 App Router, React 18, TypeScript |
| Authentication | Auth.js / NextAuth credentials provider, JWT sessions, bcrypt |
| Database | PostgreSQL on Neon, Drizzle ORM |
| Validation | Zod, React Hook Form |
| Rate limiting | Upstash Redis and `@upstash/ratelimit` |
| Background workflows | Upstash Workflow / QStash |
| Email | EmailJS |
| Media | ImageKit |
| UI | Tailwind CSS, Radix UI, shadcn-style components |
| Hosting | Vercel-compatible |

## Run locally

### 1. Requirements

- Node.js 20 or newer
- A PostgreSQL database
- Upstash Redis and QStash credentials
- ImageKit credentials
- EmailJS credentials

### 2. Install dependencies

```bash
git clone https://github.com/MOHAMMADYASSINE23/Universal_Library.git
cd Universal_Library
npm ci
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and replace the placeholders with your own values. Never commit real credentials.

The app uses `DATABASE_URL`, Auth.js/NextAuth secret settings, ImageKit, Upstash Redis/QStash, and EmailJS variables. The onboarding workflow also needs `NEXT_PUBLIC_PROD_API_ENDPOINT` to point at the deployed app that receives the workflow callback.

### 4. Prepare the database

Existing migrations are stored in `drizzle/`. Apply them with:

```bash
npm run db:migrate
```

To generate a new migration after changing `database/schema.ts`:

```bash
npm run db:generate
npm run db:migrate
```

Seed demo books if desired:

```bash
npm run seed
```

### 5. Create the first administrator

Sign up normally, then promote your own trusted account from the Neon SQL editor (replace the example email). Do not make this query available to ordinary users or put database credentials in frontend code.

```sql
UPDATE users
SET role = 'ADMIN', status = 'APPROVED'
WHERE email = 'your-admin-email@example.com';
```

Only do this for an account you control. There is no public self-service administrator registration.

### 6. Start the app

```bash
npm run dev
```

Open http://localhost:3000.

## Quality checks

```bash
npx tsc --noEmit
npm run lint
npm run build
```

GitHub Actions runs these checks on pushes and pull requests to `main`. The build workflow uses placeholder environment values only; it does not connect to a production database or send real emails.

## Security and current scope

- Administrator pages and server actions verify the account's current database role. Being signed in alone does not grant administrative permissions.
- Book borrowing requires an approved library account.
- Passwords are hashed with bcrypt; authentication attempts are rate-limited when Upstash is configured.
- ImageKit upload credentials are only issued to authenticated administrators.
- Rate limiting helps reduce abuse but is not a complete DDoS protection system.
- Email and background workflow delivery depends on external provider configuration.
- This repository does not currently include an automated integration-test suite. Test account approval, borrowing, returns, uploads, and workflow delivery with non-production credentials before deploying changes.

## License

No `LICENSE` file is currently included. Ask the repository owner before reusing or redistributing this project.
