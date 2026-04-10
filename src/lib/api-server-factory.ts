import { createApiService } from './api'
import { createClient as createServerClient } from './supabase/server'

/**
 * Returns an API service instance for use in Server Components.
 * This file is server-only.
 */
export const getServerApi = async () => {
    const supabase = await createServerClient()
    return createApiService(supabase)
}
