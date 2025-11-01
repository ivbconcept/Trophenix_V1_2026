import { supabase } from '../lib/supabase';
import type { News } from '../types/news';

export const newsService = {
  async getPublishedNews(limit: number = 10): Promise<News[]> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getNewsByCategory(category: string, limit: number = 5): Promise<News[]> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .eq('category', category)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getNewsById(id: string): Promise<News | null> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
};
