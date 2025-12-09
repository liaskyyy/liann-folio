import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fxkdkulgxxdwqwhpziwu.supabase.co'
const supabaseKey = 'sb_publishable_MgGgD2hwFAEH21_vuzqjlg_O4TkxdJC'

export const supabase = createClient(supabaseUrl, supabaseKey)