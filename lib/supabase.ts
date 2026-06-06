import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  'https://rkrltucjaqxlhwgmmhtw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrcmx0dWNqYXF4bGh3Z21taHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MTU4MTIsImV4cCI6MjA5NjI5MTgxMn0.26ZmE8zI9-kSSyRah2UcPDe56PVAJzYc4TWgEnyHT20'
)
