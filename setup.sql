-- 1. Create the items table
create table items (
  id text primary key, -- Use original IDs from local app
  user_id uuid references auth.users not null default auth.uid(),
  name text not null,
  photo text,
  type text not null,
  shape text,
  color text[],
  price numeric,
  purchase_price numeric,
  usage_count integer default 0,
  is_sold boolean default false,
  selling_price numeric,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table items enable row level security;

-- 3. Create Security Policies
create policy "Users can only see their own items"
  on items for select
  using ( auth.uid() = user_id );

create policy "Users can only insert their own items"
  on items for insert
  with check ( auth.uid() = user_id );

create policy "Users can only update their own items"
  on items for update
  using ( auth.uid() = user_id );

  using ( auth.uid() = user_id );

-- 4. Storage Setup (Allowing authenticated users to upload images)
-- This assumes you created a bucket named 'collection-images' as per instructions.

-- Policy to allow public viewing of all images in the bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'collection-images' );

-- Policy to allow any authenticated user to upload an image
create policy "Authenticated users can upload"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'collection-images' );
