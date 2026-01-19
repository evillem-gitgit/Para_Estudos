import type { Post } from '../../../types/post';
import { PostCard } from './PostCard';

interface PostListProps {
  posts: Post[];
  onEdit?: (post: Post) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
  emptyMessage?: string;
}

export function PostList({
  posts,
  onEdit,
  onDelete,
  showActions = false,
  emptyMessage = 'Nenhum post encontrado',
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
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