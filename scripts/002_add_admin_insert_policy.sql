-- Add INSERT policy for authenticated admin users
create policy "Authenticated users can insert newspapers"
  on public.newspapers for insert
  with check (auth.role() = 'authenticated');

-- Add UPDATE policy for authenticated users to update their own records
create policy "Authenticated users can update newspapers"
  on public.newspapers for update
  with check (auth.role() = 'authenticated');

-- Add DELETE policy for authenticated users
create policy "Authenticated users can delete newspapers"
  on public.newspapers for delete
  using (auth.role() = 'authenticated');
