import Link from 'next/link';
import { Baseball, Users, Share2, Camera } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Baseball className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">WePlay</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/games" className="text-gray-600 hover:text-blue-600 transition-colors">
                試合一覧
              </Link>
              <Link href="/create" className="text-gray-600 hover:text-blue-600 transition-colors">
                新規試合
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                ログイン
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ヒーローセクション */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            リアルタイムで野球を
            <span className="text-blue-600">共有</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            草野球や青少年野球の試合をリアルタイムでスコアボード共有。
            写真や動画と一緒に、みんなで野球を楽しもう。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              試合を始める
            </Link>
            <Link
              href="/games"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              試合に参加
            </Link>
          </div>
        </div>

        {/* 機能紹介 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Baseball className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">リアルタイムスコア</h3>
            <p className="text-gray-600">
              試合のスコア、アウト数、ストライク数をリアルタイムで更新・共有
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">みんなで共有</h3>
            <p className="text-gray-600">
              同じ試合を見ている人全員が同じページをリアルタイムで共有
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Share2 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">簡単共有</h3>
            <p className="text-gray-600">
              URLやQRコードで簡単に試合ページを共有
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Camera className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">写真・動画</h3>
            <p className="text-gray-600">
              試合の写真や動画を投稿して応援メッセージを共有
            </p>
          </div>
        </div>

        {/* 使い方 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">使い方</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">試合を作成</h4>
              <p className="text-gray-600">
                チーム名や選手情報を入力して試合を作成
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">スコアを更新</h4>
              <p className="text-gray-600">
                試合中にスコアや状況をリアルタイムで更新
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">みんなで共有</h4>
              <p className="text-gray-600">
                URLやQRコードで他の人と試合ページを共有
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            今すぐ始めよう
          </h3>
          <p className="text-gray-600 mb-6">
            無料で利用できます。アカウント登録は不要です。
          </p>
          <Link
            href="/create"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            試合を作成する
          </Link>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Baseball className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">WePlay</span>
              </div>
              <p className="text-gray-400">
                リアルタイム野球スコアボード共有アプリ
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">機能</h4>
              <ul className="space-y-2 text-gray-400">
                <li>リアルタイムスコア</li>
                <li>写真・動画投稿</li>
                <li>簡単共有</li>
                <li>PWA対応</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">サポート</h4>
              <ul className="space-y-2 text-gray-400">
                <li>ヘルプ</li>
                <li>よくある質問</li>
                <li>お問い合わせ</li>
                <li>プライバシーポリシー</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">開発</h4>
              <ul className="space-y-2 text-gray-400">
                <li>GitHub</li>
                <li>API仕様</li>
                <li>技術ブログ</li>
                <li>貢献</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 WePlay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
