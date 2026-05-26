/* Taleo Story World: public published stories and child-friendly reactions.
   All access goes through the service-role API routes — no direct client access. */

-- ────────────────────────────────────────────────────────────
-- 1. story_world_posts: explicit published entries
-- ────────────────────────────────────────────────────────────
create table if not exists public.story_world_posts (
  id                  uuid primary key default gen_random_uuid(),
  story_id            text not null references public.taleo_stories (id) on delete cascade,
  title               text not null,
  description         text not null default '',
  category            text not null default 'Adventure',
  display_name        text not null default 'Little Storyteller',
  cover_image_url     text,
  publisher_user_id   uuid references auth.users (id) on delete set null,
  is_public           boolean not null default true,
  is_approved         boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists story_world_posts_created_at_idx
  on public.story_world_posts (created_at desc);

create index if not exists story_world_posts_category_idx
  on public.story_world_posts (category);

create index if not exists story_world_posts_publisher_idx
  on public.story_world_posts (publisher_user_id);

-- Prevent the same story being published multiple times
create unique index if not exists story_world_posts_story_id_unique
  on public.story_world_posts (story_id);

drop trigger if exists story_world_posts_set_updated_at on public.story_world_posts;

create trigger story_world_posts_set_updated_at
before update on public.story_world_posts
for each row
execute function public.set_updated_at();

-- ────────────────────────────────────────────────────────────
-- 2. story_world_reactions: emoji reactions per post
-- ────────────────────────────────────────────────────────────
create table if not exists public.story_world_reactions (
  id            uuid primary key default gen_random_uuid(),
  post_id       uuid not null references public.story_world_posts (id) on delete cascade,
  reaction_type text not null check (
    reaction_type in ('love_it', 'funny', 'magical', 'great_story')
  ),
  user_id       uuid references auth.users (id) on delete set null,
  session_id    text,  -- client-generated UUID for unauthenticated dedup
  created_at    timestamptz not null default now()
);

create index if not exists story_world_reactions_post_idx
  on public.story_world_reactions (post_id);

-- One reaction per authenticated user per post
create unique index if not exists story_world_reactions_user_unique
  on public.story_world_reactions (post_id, user_id)
  where user_id is not null;

-- One reaction per session per post (unauthenticated dedup)
create unique index if not exists story_world_reactions_session_unique
  on public.story_world_reactions (post_id, session_id)
  where session_id is not null and user_id is null;

-- ────────────────────────────────────────────────────────────
-- 3. RLS — block all direct client access (same pattern as taleo_stories)
-- ────────────────────────────────────────────────────────────
alter table public.story_world_posts enable row level security;

drop policy if exists "story_world_posts_no_direct_api" on public.story_world_posts;

create policy "story_world_posts_no_direct_api"
  on public.story_world_posts
  for all
  to anon, authenticated
  using (false)
  with check (false);

alter table public.story_world_reactions enable row level security;

drop policy if exists "story_world_reactions_no_direct_api" on public.story_world_reactions;

create policy "story_world_reactions_no_direct_api"
  on public.story_world_reactions
  for all
  to anon, authenticated
  using (false)
  with check (false);
