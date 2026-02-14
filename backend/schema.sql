
-- RESET SCRIPT (Run this first if you have errors about existing tables)
-- WARNING: This will delete existing data in these tables!
drop table if exists public.messages cascade;
drop table if exists public.chat_users cascade;
drop table if exists public.gallery cascade;
drop table if exists public.students cascade;
drop function if exists public.func_login;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: Students (Class Members)
create table public.students (
    id uuid primary key default uuid_generate_v4(),
    full_name text not null,
    nickname text not null,
    role text check (role in ('KM', 'Wakil KM', 'Sekretaris', 'Bendahara', 'Siswa')) default 'Siswa',
    nis text unique not null,
    specialty text, -- e.g. Frontend, Backend, UI/UX
    valorant_agent text, -- e.g. Jett, Reyna
    avatar_url text,
    bio_quote text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: Gallery (Memories)
create table public.gallery (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    image_url text not null,
    category text check (category in ('Classmeet', 'Study', 'Hangout', 'Other')) default 'Other',
    uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: Chat Users (Squad Members)
create table public.chat_users (
    username text primary key,
    pin_code text not null, -- Simple PIN for "login"
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: Messages (Chat)
create table public.messages (
    id uuid primary key default uuid_generate_v4(),
    user_name text references public.chat_users(username) on delete cascade not null,
    user_avatar text,
    content text not null,
    room_id text default 'general',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) policies

-- Enable RLS on all tables
alter table public.students enable row level security;
alter table public.gallery enable row level security;
alter table public.messages enable row level security;
alter table public.chat_users enable row level security;

-- Policy: Chat Users
create policy "Allow Public Read on Chat Users"
on public.chat_users for select using (true);

create policy "Allow Public Insert on Chat Users"
on public.chat_users for insert with check (true);

-- Policy: Allow Public Read Access (Anyone can view)
create policy "Allow Public Read Access on Students" 
on public.students for select using (true);


create policy "Allow Public Read Access on Gallery" 
on public.gallery for select using (true);

create policy "Allow Public Read Access on Messages" 
on public.messages for select using (true);

-- Policy: Allow Client Insert on Messages
create policy "Allow Client Insert on Messages" 
on public.messages for insert with check (true); 

-- Realtime Setup
-- Remember to enable Realtime for 'messages' in Supabase Dashboard > Database > Replication

-- RPC Function: Secure Login
-- Returns the user record if username and pin match, otherwise null.
create or replace function public.func_login(username_in text, pin_in text)
returns setof public.chat_users
language plpgsql
security definer
as $$
begin
  return query
  select *
  from public.chat_users
  where username = username_in
  and pin_code = pin_in;
end;
$$;

-- Seed Data: Random Student
insert into public.students (full_name, nickname, role, nis, specialty, valorant_agent, bio_quote)
values
('Ryu "The Glitch" Kurniadi', 'Ryu', 'Siswa', '212210001', 'Cyber Security', 'Cypher', 'I see everything.');


-- Table: Menfess (Songfess & Anonymous Messages)
create table public.menfess (
    id uuid primary key default uuid_generate_v4(),
    sender_name text default 'Anonymous',
    recipient_name text default 'Everyone',
    message text not null,
    spotify_track_id text,
    spotify_track_name text,
    spotify_artist_name text,
    spotify_image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Menfess
alter table public.menfess enable row level security;

-- Policy: Allow Public Read Access on Menfess
create policy "Allow Public Read Access on Menfess" 
on public.menfess for select using (true);

-- Policy: Allow Public Insert on Menfess
create policy "Allow Public Insert on Menfess" 
on public.menfess for insert with check (true);
