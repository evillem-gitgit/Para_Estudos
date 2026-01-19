import { Loader } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';
import { PostList } from '../components/features/posts/PostList';


export function Home() {
  const { user } = useAuth();
  const { posts, isLoading } = usePosts();
  
  
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

        {/* Posts List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Posts Publicados</h2>
          <PostList
            posts={posts}
            showActions={true}
            emptyMessage="Você ainda não criou nenhum post. Clique em 'Novo Post' para começar!"
          />
        </div>
      </div>
    </div>
  );
}