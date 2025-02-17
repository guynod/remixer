-- Create an enum for tweet status if needed later
create type public.tweet_status as enum ('draft', 'published', 'archived');

-- Create the tweets table with proper constraints and indexes
create table public.tweets (
    id uuid default gen_random_uuid() primary key,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references auth.users(id),
    status public.tweet_status default 'published'::public.tweet_status,
    
    -- Add constraint to ensure content isn't empty and meets Twitter's length requirement
    constraint tweets_content_length check (char_length(content) > 0 and char_length(content) <= 280)
);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger tweets_updated_at
    before update on public.tweets
    for each row
    execute procedure public.handle_updated_at();

-- Create indexes for better query performance
create index tweets_user_id_idx on public.tweets(user_id);
create index tweets_created_at_idx on public.tweets(created_at desc);
create index tweets_status_idx on public.tweets(status);

-- Set up Row Level Security (RLS)
alter table public.tweets enable row level security;

-- Create policies
create policy "Tweets are viewable by everyone"
    on public.tweets for select
    using (true);

create policy "Users can insert their own tweets"
    on public.tweets for insert
    with check (
        auth.uid() = user_id or
        user_id is null  -- Allow anonymous posts for now
    );

create policy "Users can update their own tweets"
    on public.tweets for update
    using (auth.uid() = user_id);

create policy "Users can delete their own tweets"
    on public.tweets for delete
    using (auth.uid() = user_id);

-- Create a function to clean up old tweets if needed
create or replace function public.cleanup_old_tweets()
returns void as $$
begin
    delete from public.tweets
    where created_at < now() - interval '1 year'
    and status = 'archived';
end;
$$ language plpgsql; 