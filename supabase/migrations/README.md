# Database Migrations

This directory contains SQL migrations for the Supabase database.

## How to Apply Migrations

To apply the migrations, you need to use the Supabase CLI. Follow these steps:

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Login to your Supabase account:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref fajtzqkkkaszbqemldel
   ```

4. Apply the migrations:
   ```bash
   supabase db push
   ```

## Migration Files

- `20240520000000_add_user_subscriptions_profiles_fk.sql`: Adds a foreign key relationship between the `user_subscriptions` and `profiles` tables to fix the "Could not find a relationship between 'user_subscriptions' and 'profiles'" error.

## Important Notes

- Always backup your database before applying migrations.
- Test migrations in a development environment before applying them to production.
- If you encounter any issues, you can revert the migration by running:
  ```bash
  supabase db reset
  ```
  Note that this will reset your entire database, so use with caution.
