import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import invariant from 'tiny-invariant'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE

invariant(supabaseUrl, 'SUPABASE_URL is not set')
invariant(supabaseServiceRole, 'SUPABASE_SERVICE_ROLE is not set')

let sb: SupabaseClient

declare global {
  var __sb: SupabaseClient | undefined
}

if (process.env.NODE_ENV === 'production') {
  sb = createClient(supabaseUrl, supabaseServiceRole)
} else {
  if (!global.__sb) {
    global.__sb = createClient(supabaseUrl, supabaseServiceRole)
  }
  sb = global.__sb
}

export { sb }
