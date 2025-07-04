'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useAuthStore } from '../../lib/stores/authStore';
import { LoginFormData } from '../../lib/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await login(formData);
      router.push('/games');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました');
    }
  };

  return (
    <Layout 
      currentPage="login" 
      showHeader={false}
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <h1 className="text-3xl font-bold text-gray-900">WePlay</h1>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          アカウントにログイン
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          または{' '}
          <Link href="/register" className="font-medium text-green-600 hover:text-green-500">
            新しいアカウントを作成
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              label="メールアドレス"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@example.com"
            />

            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              label="パスワード"
              value={formData.password}
              onChange={handleChange}
              placeholder="パスワードを入力"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  ログイン状態を保持
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                  パスワードを忘れた場合
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
            >
              ログイン
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">または</span>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/games">
                <Button variant="outline" fullWidth>
                  ゲストとして試合を見る
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}