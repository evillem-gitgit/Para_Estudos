export interface Post {
  id: number;
  title: string;
  content: string;
  is_published: boolean;
  author_id: number;
  created_at: string;
}

export interface PostCreate {
  title: string;
  content: string;
  is_published?: boolean;
}

export interface PostUpdate {
  title?: string;
  content?: string;
  is_published?: boolean;
}