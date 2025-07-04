'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';
import { useGameStore } from '../../lib/stores/gameStore';
import { GameStatus } from '../../lib/types';

export default function GamesPage() {
  const { games, isLoading, error, fetchGames } = useGameStore();

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const getStatusBadge = (status: GameStatus) => {
    switch (status) {
      case GameStatus.IN_PROGRESS:
        return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">進行中</span>;
      case GameStatus.FINISHED:
        return <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">終了</span>;
      case GameStatus.WAITING:
        return <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">待機中</span>;
      case GameStatus.SUSPENDED:
        return <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">中断</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Layout currentPage="games">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout currentPage="games">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={fetchGames}>再試行</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="games">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">試合一覧</h1>
            <Link href="/create">
              <Button>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                新しい試合を作成
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="mb-6 flex space-x-4">
            <Button size="sm">すべて</Button>
            <Button variant="outline" size="sm">進行中</Button>
            <Button variant="outline" size="sm">終了</Button>
            <Button variant="outline" size="sm">待機中</Button>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <Link key={game.id} href={`/games/${game.id}`}>
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{game.title}</h3>
                      {getStatusBadge(game.status)}
                    </div>
                    
                    <div className="space-y-3">
                      {/* Score Display */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div className="text-center">
                            <div className="text-sm text-gray-600">{game.awayTeam.name}</div>
                            <div className="text-2xl font-bold text-gray-900">{game.awayScore}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">VS</div>
                            {game.status === GameStatus.IN_PROGRESS && (
                              <div className="text-xs text-gray-500">
                                {game.inning}回{game.isTopHalf ? '表' : '裏'}
                              </div>
                            )}
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600">{game.homeTeam.name}</div>
                            <div className="text-2xl font-bold text-gray-900">{game.homeScore}</div>
                          </div>
                        </div>
                      </div>

                      {/* Game Info */}
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{formatDate(game.createdAt.toString())}</span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          試合を見る
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {games.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">試合がありません</h3>
              <p className="mt-1 text-sm text-gray-500">新しい試合を作成して開始しましょう。</p>
              <div className="mt-6">
                <Link href="/create">
                  <Button>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    新しい試合を作成
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}