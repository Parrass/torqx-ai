
-- Update RLS policies for tenants table to allow registration
-- First, let's see if there are existing policies and drop them if needed
DROP POLICY IF EXISTS "Users can only access their own tenant" ON tenants;
DROP POLICY IF EXISTS "Only authenticated users can insert tenants" ON tenants;

-- Enable RLS on tenants table (if not already enabled)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert new tenants (for registration)
CREATE POLICY "Allow tenant creation during registration" 
ON tenants 
FOR INSERT 
WITH CHECK (true);

-- Allow users to view only their own tenant data
CREATE POLICY "Users can view their own tenant" 
ON tenants 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.tenant_id = tenants.id 
    AND users.id = auth.uid()
  )
);

-- Allow users to update only their own tenant data
CREATE POLICY "Users can update their own tenant" 
ON tenants 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.tenant_id = tenants.id 
    AND users.id = auth.uid()
  )
);
