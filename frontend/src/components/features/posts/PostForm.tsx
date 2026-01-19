import { useState, type FormEvent, useEffect } from 'react';
import type { Post, PostCreate } from '../../../types/post';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { Card } from '../../common/Card';

interface PostFormProps {
  post?: Post;
  onSubmit: (data: PostCreate) => Promise<void>;
  onCancel?: () => void;
}

export function PostForm({ post, onSubmit, onCancel }: PostFormProps) {
  const [formData, setFormData] = useState<PostCreate>({
    title: '',
    content: '',
    is_published: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        is_published: post.is_published,
      });
    }
  }, [post]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.title.trim() === '' || formData.content.trim() === '') {
        alert('Por favor, preencha todos os campos!.');
        return;
      }

    setIsLoading(true);

    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {post ? 'Editar Post' : 'Novo Post'}
        </h3>

        <Input
          label="Título"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Digite o título do post"
          required
        />

        <div>
          <label className="label">Conteúdo</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Digite o conteúdo do post"
            rows={6}
            className="input"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_published"
            checked={formData.is_published}
            onChange={(e) =>
              setFormData({ ...formData, is_published: e.target.checked })
            }
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="is_published" className="text-sm text-gray-700 cursor-pointer">
            Publicar imediatamente
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
            {post ? 'Atualizar' : 'Criar'} Post
          </Button>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}