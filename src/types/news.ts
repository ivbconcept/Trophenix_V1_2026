export interface News {
  id: string;
  title: string;
  content: string;
  category: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  author_id: string | null;
  is_published: boolean;
}

export type NewsCategory = 'annonce' | 'partenariat' | 'technique' | 'événement' | 'success' | 'general';
