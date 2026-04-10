import { createApiService } from './api'
import { createClient as createBrowserClient } from './supabase/client'

/**
 * Returns an API service instance for use in Client Components.
 * This file is safe for client-side bundling.
 */
export const getClientApi = () => {
    const supabase = createBrowserClient()
    return createApiService(supabase)
}
