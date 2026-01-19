export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Meu Projeto. Feito com ❤️ usando React + FastAPI</p>
        </div>
      </div>
    </footer>
  );
}