import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import type { Post } from '../../../types/post';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { formatDate, truncateText } from '../../../utils/helpers';

interface PostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export function PostCard({ post, onEdit, onDelete, showActions = false }: PostCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{formatDate(post.created_at)}</span>
            {post.is_published ? (
              <span className="flex items-center gap-1 text-green-600">
                <Eye className="w-4 h-4" />
                Publicado
              </span>
            ) : (
              <span className="flex items-center gap-1 text-gray-500">
                <EyeOff className="w-4 h-4" />
                Rascunho
              </span>
            )}
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="secondary"
                onClick={() => onEdit(post)}
                className="p-2"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                onClick={() => onDelete(post.id)}
                className="p-2"
                title="Deletar"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      <p className="text-gray-700 leading-relaxed">
        {truncateText(post.content, 200)}
      </p>
    </Card>
  );
}