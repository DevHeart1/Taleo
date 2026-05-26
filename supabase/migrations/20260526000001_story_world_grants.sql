/* Grant privileges on Story World tables to all roles.
   Since RLS is enabled and set to reject all anon/authenticated access,
   direct API requests are still blocked, but service-role queries will succeed. */

grant all on public.story_world_posts to postgres, service_role, anon, authenticated;
grant all on public.story_world_reactions to postgres, service_role, anon, authenticated;
