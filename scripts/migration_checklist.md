# Migration Checklist

This checklist maps SQL migration files under `scripts/` to the primary database objects they create or modify. Use this to verify which migrations have been applied.

- `001_create_profiles_table.sql`: creates `profiles` table (user/company profile fields).
- `002_create_companies_table.sql`: creates `companies` table and related indexes.
- `003_create_user_tenders_table.sql`: creates `user_tenders` (or `user_custom_tenders`) base table.
- `004_create_tender_documents_table.sql`: creates `tender_documents` (file metadata) table.
- `005_create_scraped_tenders_table.sql`: creates `scraped_tenders` table for scraped sources.
- `006_create_tender_sources_table.sql`: creates `tender_sources` table and seed data.
- `007_add_unique_constraint_scraped_tenders.sql`: adds unique constraint/index on `scraped_tenders` (source/id).
- `008_check_scraped_tenders_count.sql`: query/maintenance script — no schema change.
- `009_seed_test_tenders.sql`: inserts seed tenders for testing.
- `010_fix_tender_sources_id.sql`: alters `tender_sources` id column or FK fixes.
- `011-strategist-tables.sql`: creates strategist-related tables (competitiveness/opportunity tables).
- `012_create_tender_documents_table.sql`: duplicate/variant of 004; check for idempotency or schema adjustments.
- `013_check_scraped_tenders_structure.sql`: structural checks/fixes (read-only checks).
- `014_create_tender_analysis_table.sql`: creates `user_custom_tender_analysis` table to store analysis payloads.
- `015_create_tender_responses_table.sql`: creates `tender_responses` table (user responses/submissions).
- `016_add_company_bee_vat_fields.sql`: alters `companies` to add VAT/registration fields.
- `017_create_usage_tracking_tables.sql`: creates usage event/metrics tables.
- `018_create_admin_users_table.sql`: creates `admin_users` table.
- `018_fix_strategist_policies.sql`: policy fixes (RLS) for strategist tables.
- `019_fix_all_existing_policies.sql`: RLS/policy fixes across tables.
- `020_add_tender_source_presets.sql`: inserts/updates source preset rows.
- `021_add_tender_progress_tracking.sql`: creates `tender_progress` or similar tracking table.
- `021_disable_rls_on_admin_tables.sql`: toggles/disables RLS for admin tables.
- `022_create_subscriptions_table.sql`: creates `subscriptions` table for billing.
- `022_add_comprehensive_requirements.sql`: adds columns/tables for requirements/specs.
- `023_add_boq_and_financial_planning.sql`: adds BOQ, financial planning tables/columns.
- `024_add_scraping_progress_table.sql`: creates table to track scraping progress.
- `024_reset_scraped_tenders.sql`: maintenance script to reset scraped tenders state.
- `025_create_custom_tenders_tables.sql`: creates `user_custom_tenders` and related tables.
- `025_add_project_plans_unique_constraint.sql`: adds unique constraint for project plans.
- `026_update_etender_sources_to_api.sql`: updates etender source entries to use API source type.
- `026_fix_tender_documents_for_custom_tenders.sql`: schema fixes for tender documents referencing custom tenders.
- `027_fix_tender_analysis_for_custom_tenders.sql`: adjusts analysis table/columns for custom tenders.
- `027_onboarding_enhancements.sql`: onboarding schema/data improvements.
- `028_fix_tender_documents_schema_v2.sql`: more schema fixes for tender documents.
- `028_multi_company_support.sql`: alter tables to support multi-company relationships (company_id fks).
- `029_fix_tender_analysis_schema_v2.sql`: further changes to `user_custom_tender_analysis` schema.
- `029_align_company_fields_with_onboarding.sql`: sync company profile fields with onboarding.
- `030_verify_and_fix_custom_tenders_schema.sql`: verification/fix script for custom tenders' schema.
- `031_recreate_custom_tenders_tables.sql`: recreates or migrates custom tenders tables (destructive migration).
- `033_unify_tenders.sql`: schema migration unifying scraped/custom tenders into single model.
- `034_create_orchestration_progress.sql`: creates orchestration progress tracking table.
- `034_setup_storage.sql`: storage setup for Supabase storage buckets and policies.
- `035_relax_mime_types.sql`: relaxes allowed MIME types for uploads (file_types column changes).
- `036_add_custom_tender_field_history_and_confidences.sql`: adds `user_custom_tender_field_history` table and `extraction_confidences` JSONB column on `user_custom_tenders`.
- `create-tender-source-function.sql`: adds DB function to create tender sources.
- `add-etender-api-source.sql`: insert etender API source row.
- `ensure-etender-source-exists.sql`: idempotent upsert for etender source.

Notes:

- Some files are maintenance/seed scripts (e.g., `*_seed_*.sql`, `*_check_*.sql`) and may not change schema.
- A few files appear duplicated by name/number — inspect their contents for idempotency before applying.
- The canonical migration to add `user_custom_tender_field_history` and `extraction_confidences` is `036_add_custom_tender_field_history_and_confidences.sql`.

How to verify which have been applied:

1. Connect to your DB and check for the presence of core tables, e.g.:

```sql
SELECT to_regclass('public.user_custom_tenders'), to_regclass('public.user_custom_tender_analysis'), to_regclass('public.user_custom_tender_field_history');
```

2. Check for specific columns added by migrations, e.g.:

```sql
SELECT column_name FROM information_schema.columns WHERE table_name='user_custom_tenders' AND column_name='extraction_confidences';
```

3. Use the `scripts/apply_migration.mjs` tool to apply a migration file when needed.

If you want, I can produce a CSV that maps each script to the exact CREATE/ALTER statements (parsing files), or run automated checks against a provided `DATABASE_URL` to report which scripts are not applied. Tell me which option you prefer.
