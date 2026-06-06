# Database Schema Setup Guide

## Problem
The admin interface attempts to mark photos, reviews, and pricing items as "featured", but the required database columns don't exist in Supabase.

## Solution
Add the `featured` and `featured_order` columns to your Supabase tables.

## Steps to Fix

### 1. Go to Supabase Dashboard
- Visit [https://supabase.com](https://supabase.com)
- Open your project dashboard

### 2. Open SQL Editor
- Click on "SQL Editor" in the left sidebar
- Click "New Query"

### 3. Copy and Run the Following SQL

```sql
-- Add featured columns to photos table
ALTER TABLE photos ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS featured_order integer DEFAULT null;

-- Add featured columns to reviews table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS featured_order integer DEFAULT null;

-- Add featured columns to pricing table
ALTER TABLE pricing ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
ALTER TABLE pricing ADD COLUMN IF NOT EXISTS featured_order integer DEFAULT null;
```

### 4. Click "Run"
Wait for the query to complete successfully.

### 5. Test the Admin Interface
- Go to `/admin` on your site
- Navigate to the "Featured Items" tab
- Select items to feature and click "Save Featured Items"
- You should see a success message

## What These Columns Do

- **featured** (boolean): Marks whether an item should be displayed as featured
- **featured_order** (integer): Optional field for controlling the order of featured items

## Rollback (if needed)

If you need to remove these columns, run:

```sql
ALTER TABLE photos DROP COLUMN featured;
ALTER TABLE photos DROP COLUMN featured_order;

ALTER TABLE reviews DROP COLUMN featured;
ALTER TABLE reviews DROP COLUMN featured_order;

ALTER TABLE pricing DROP COLUMN featured;
ALTER TABLE pricing DROP COLUMN featured_order;
```

## Error Messages

If you see one of these errors, it means the columns don't exist yet:

- "Failed to save featured photos: Could not find the 'featured' column of 'photos'"
- "Failed to save featured reviews: Could not find the 'featured' column of 'reviews'"
- "Failed to save featured pricing: Could not find the 'featured' column of 'pricing'"

Use the SQL commands above to fix them.
