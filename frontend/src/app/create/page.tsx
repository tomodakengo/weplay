'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useGameStore } from '../../lib/stores/gameStore';
import { CreateGameFormData } from '../../lib/types';

export default function CreateGamePage() {
  const router = useRouter();
  const { createGame, isLoading } = useGameStore();
  const [formData, setFormData] = useState<CreateGameFormData>({
    title: '',
    homeTeamName: '',
    awayTeamName: '',
    description: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const newGame = await createGame(formData);
      router.push(`/games/${newGame.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '試合の作成に失敗しました');
    }
  };

  return (
    <Layout currentPage="create">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">新しい試合を作成</h1>
            <p className="mt-2 text-gray-600">
              リアルタイムでスコアを共有できる野球試合を作成します
            </p>
          </div>

          <div className="bg-white shadow rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {error && <ErrorMessage>{error}</ErrorMessage>}

              <Input
                label="試合タイトル"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="例: 草野球リーグ 第1試合"
                helperText="試合の名前を入力してください"
              />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                  label="ホームチーム"
                  name="homeTeamName"
                  value={formData.homeTeamName}
                  onChange={handleChange}
                  required
                  placeholder="例: レッドイーグルス"
                />

                <Input
                  label="アウェイチーム"
                  name="awayTeamName"
                  value={formData.awayTeamName}
                  onChange={handleChange}
                  required
                  placeholder="例: ブルーライオンズ"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  試合の説明
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="例: 地区大会決勝戦。午後2時開始予定。"
                />
                <p className="mt-1 text-sm text-gray-500">
                  試合についての詳細情報（任意）
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      試合作成後について
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>試合を作成すると、スコアボードページが生成されます</li>
                        <li>スコアボードのURLを共有することで、他の人も試合を見ることができます</li>
                        <li>リアルタイムでスコアや状況を更新できます</li>
                        <li>観戦者はコメントや写真を投稿できます</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/games')}
                >
                  キャンセル
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                >
                  試合を作成
                </Button>
              </div>
            </form>
          </div>

          {/* Quick Start Guide */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              クイックスタートガイド
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 font-semibold text-sm">
                    1
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">試合を作成</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    チーム名と試合タイトルを入力
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 font-semibold text-sm">
                    2
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">URLを共有</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    スコアボードのURLを参加者に共有
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 font-semibold text-sm">
                    3
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">試合開始</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    リアルタイムでスコアを更新
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}