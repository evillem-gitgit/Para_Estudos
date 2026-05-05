import type { User } from './user';

export interface Post {
  id: number;
  title: string;
  content: string;
  is_published: boolean;
  author_id: number;
  created_at: string;
  author: Pick<User, 'id' | 'username' | 'full_name'>;
}

//Pick permite "pegar" apenas algumas propriedades de um tipo existente.

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