-- Execute the following SQL in the Supabase SQL Editor (https://app.supabase.com)

-- 1. Enable Row Level Security on the orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 2. Allow authenticated users to insert their own orders
-- This policy ensures that the user_id of the new row matches the authenticated user's ID.
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
CREATE POLICY "Users can insert their own orders" 
ON orders FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 3. Allow authenticated users to view their own orders
-- This policy ensures users can only see orders they placed.
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" 
ON orders FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- 4. Enable Force RLS to ensure it's always applied
ALTER TABLE orders FORCE ROW LEVEL SECURITY;

-- 5. (Optional) Allow authenticated users to update their own orders (e.g., to cancel)
-- Note: Usually, order status updates are handled by the system or restaurant owner.
-- CREATE POLICY "Users can update their own orders" 
-- ON orders FOR UPDATE 
-- TO authenticated 
-- USING (auth.uid() = user_id);
