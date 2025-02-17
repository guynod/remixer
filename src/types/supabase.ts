export type TweetStatus = 'draft' | 'published' | 'archived';

export interface Tweet {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  status: TweetStatus;
}

export type NewTweet = Omit<Tweet, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export interface Database {
  public: {
    Tables: {
      tweets: {
        Row: Tweet;
        Insert: NewTweet;
        Update: Partial<NewTweet>;
      };
    };
    Enums: {
      tweet_status: TweetStatus;
    };
  };
} 