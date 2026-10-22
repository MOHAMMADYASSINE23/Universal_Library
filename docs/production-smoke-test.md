# End-to-End Smoke-Test Checklist

Use this checklist after deploying a change that affects authentication, borrowing, administration, uploads, email, or background workflows.

> **Safety:** Run these checks against a staging deployment and a non-production database. Use test accounts and test provider credentials. Never paste secrets, session cookies, or real user data into an issue or pull request.

## Before testing

- [ ] Confirm the deployment points to a non-production database.
- [ ] Confirm required environment variables are configured in the staging environment.
- [ ] Confirm database migrations have been applied.
- [ ] Prepare one test reader account and one administrator account.
- [ ] Record the current available-copy count for any test book.
- [ ] Use a test email inbox and test media assets.

## Authentication and account approval

- [ ] Sign up with a new valid email and password. The account is created without exposing password data in the UI.
- [ ] Try signing up with invalid or missing required fields. The form shows a useful validation message.
- [ ] Try signing in with an incorrect password. Authentication fails without revealing whether a password or account detail was wrong.
- [ ] Sign in with valid credentials and confirm the expected account state is shown.
- [ ] As an administrator, approve the new reader account.
- [ ] Confirm a non-admin account cannot access administrator pages or invoke administrator actions directly.

## Book management and media

- [ ] As an administrator, create a book with valid required fields.
- [ ] Confirm the book appears in the catalog and its detail page loads.
- [ ] If ImageKit is configured, upload a test cover as an administrator and confirm the image displays.
- [ ] Attempt the upload flow as a non-admin or signed-out user. No upload authorization should be issued.
- [ ] Try invalid book input and confirm the operation is rejected with a clear error.

## Borrowing, rejection, and returns

- [ ] As an approved reader, request a book that has an available copy.
- [ ] As an administrator, approve the request and confirm the loan state changes.
- [ ] Confirm the available-copy count changes consistently with the app's borrowing rules.
- [ ] Return the borrowed book as an administrator and confirm the loan is no longer active.
- [ ] Confirm the available-copy count is restored exactly once.
- [ ] Submit another borrowing request and reject it as an administrator. Confirm it does not create an active loan or incorrectly reduce availability.
- [ ] Try borrowing as an unapproved account and confirm the action is blocked.
- [ ] Try duplicate or repeated actions where practical and confirm they do not create duplicate active loans or corrupt copy counts.

## Reviews and authorization

- [ ] Submit a review for a book after an eligible completed borrowing flow.
- [ ] Attempt to review a book without meeting the app's eligibility rules. The request should be rejected.
- [ ] Try changing a resource identifier in a URL or request to access another user's restricted data. The server must enforce authorization.
- [ ] Sign out and revisit a protected page or repeat a protected action. Access must be denied or redirected.

## Email and background workflows

- [ ] Trigger an onboarding or notification flow using test accounts.
- [ ] Confirm the expected test email arrives, if email delivery is enabled.
- [ ] Confirm a workflow callback targets the staging deployment, not production.
- [ ] Check application and provider logs for failed callbacks, retries, or unexpected errors.
- [ ] If a provider is intentionally unavailable, confirm the app fails gracefully and does not expose credentials or internal stack traces.

## Finish and record results

- [ ] Review application logs for unexpected errors during the test.
- [ ] Confirm no test secrets, personal data, or session tokens were added to logs, screenshots, or commits.
- [ ] Clean up test records if appropriate for the staging environment.
- [ ] Record each result as **Pass**, **Fail**, or **Not configured** and include a short reproduction note for failures.
- [ ] Run the automated CI checks as well. A successful build is not a substitute for these integration checks.

## Suggested result template

| Area | Result | Notes |
| --- | --- | --- |
| Authentication and approval | Not run | |
| Book management and upload | Not run | |
| Borrowing and returns | Not run | |
| Review permissions | Not run | |
| Email and workflows | Not run | |
| Logs and cleanup | Not run | |
