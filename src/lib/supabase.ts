import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface SavedTweet {
  id: string
  content: string
  created_at: string
  user_id?: string
}

export async function saveTweet(content: string): Promise<SavedTweet | null> {
  const { data, error } = await supabase
    .from('tweets')
    .insert([{ content }])
    .select()
    .single()

  if (error) {
    console.error('Error saving tweet:', error)
    throw error
  }

  return data
}

export async function getAllTweets(): Promise<SavedTweet[]> {
  const { data, error } = await supabase
    .from('tweets')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tweets:', error)
    throw error
  }

  return data || []
}

export async function deleteTweet(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('tweets')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting tweet:', error)
      throw error
    }

    // Verify the deletion by trying to fetch the tweet
    const { data: checkData } = await supabase
      .from('tweets')
      .select()
      .eq('id', id)
      .single()

    // If we can still find the tweet, deletion failed
    if (checkData) {
      throw new Error('Tweet still exists after deletion attempt')
    }

    return true
  } catch (error) {
    console.error('Delete operation failed:', error)
    throw error
  }
} 