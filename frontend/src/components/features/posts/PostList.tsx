import type { Post } from '../../../types/post';
import { PostCard } from './PostCard';
import { useAuth } from '../../../hooks/useAuth';

interface PostListProps {
  posts: Post[];
  onEdit?: (post: Post) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
  filterByCurrentUser?: boolean;
  emptyMessage?: string;
}

export function PostList({
  posts,
  onEdit,
  onDelete,
  showActions = false, // permite que eu delete ou modifique o post
  filterByCurrentUser = false, //aqui filtra so os meus posts
  emptyMessage = 'Nenhum post encontrado',
}: PostListProps) {
  const { user } = useAuth();

  // ✅ Filtrar se necessário
  const filtered = filterByCurrentUser 
    ? posts.filter(post => post.author_id === user?.id)
    : posts;

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts && filtered.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions={showActions}
        />
      ))}
    </div>
  );
}