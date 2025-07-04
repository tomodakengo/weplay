import Link from 'next/link';

interface HeaderProps {
  currentPage?: 'home' | 'games' | 'create' | 'login' | 'register';
}

export default function Header({ currentPage }: HeaderProps) {
  const isActivePage = (page: string) => currentPage === page;

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              WePlay
            </Link>
            <span className="ml-2 text-sm text-gray-600 hidden sm:inline">
              ⚾ リアルタイム野球スコアボード
            </span>
            <nav className="ml-10 flex space-x-8 hidden md:flex">
              <Link 
                href="/games" 
                className={`transition-colors ${
                  isActivePage('games')
                    ? 'text-green-600 font-medium'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                試合一覧
              </Link>
              <Link 
                href="/create" 
                className={`transition-colors ${
                  isActivePage('create')
                    ? 'text-green-600 font-medium'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                試合作成
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/login" 
                className={`transition-colors ${
                  isActivePage('login')
                    ? 'text-green-600 font-medium'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                ログイン
              </Link>
              <Link 
                href="/register" 
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActivePage('register')
                    ? 'bg-green-700 text-white'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                新規登録
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}