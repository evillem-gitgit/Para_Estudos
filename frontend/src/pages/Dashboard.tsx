import { useState } from 'react';
import { Plus, Loader } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';
import { Button } from '../components/common/Button';
import { PostList } from '../components/features/posts/PostList';
import { PostForm } from '../components/features/posts/PostForm';
import type { Post, PostCreate } from '../types/post';

export function Dashboard() {
  const { user } = useAuth();
  const { posts, isLoading, error, createPost, updatePost, deletePost } = usePosts();
  
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>(undefined);

  const handleCreatePost = async (data: PostCreate) => {
    const newPost = await createPost(data);
    if (newPost) {
      setShowForm(false);
    }
  };

  const handleUpdatePost = async (data: PostCreate) => {
    if (editingPost) {
      const updated = await updatePost(editingPost.id, data);
      if (updated) {
        setEditingPost(undefined);
        setShowForm(false);
      }
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setShowForm(true);
  };

const handleDelete = async (id: number) => {
  console.log('🗑️ Tentando deletar post ID:', id);
  if (window.confirm('Tem certeza que deseja deletar este post?')) {
    console.log('✅ Confirmado. Chamando deletePost...');
    const success = await deletePost(id);
    if (success) {
      // Post deletado com sucesso
      console.log('Post deletado!');
    } else {
      console.error('Erro ao deletar post');
    }
  }
};

  const handleCancel = () => {
    setShowForm(false);
    setEditingPost(undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {user?.full_name || user?.username}! 👋
          </h1>
          <p className="text-gray-600">Gerencie seus posts aqui</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Create Post Button */}
        {!showForm && (
          <div className="mb-6">
            <Button
              variant="primary"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Novo Post
            </Button>
          </div>
        )}

        {/* Post Form */}
        {showForm && (
          <div className="mb-8">
            <PostForm
              post={editingPost}
              onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Posts List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Meus Posts</h2>
          <PostList
            posts={posts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showActions={true}
            emptyMessage="Você ainda não criou nenhum post. Clique em 'Novo Post' para começar!"
          />
        </div>
      </div>
    </div>
  );
}