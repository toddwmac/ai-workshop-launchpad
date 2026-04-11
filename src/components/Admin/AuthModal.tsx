import { useState } from 'react';
import { Lock } from 'lucide-react';
import type { AuthProps } from '../../types';
import { Modal } from '../UI/Modal';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';

export function AuthModal({ onAuthenticate, onLogout, isAuthenticated }: AuthProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAuthenticate(password)) {
      setPassword('');
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <Modal isOpen={!isAuthenticated} onClose={() => {}}>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-center">
          <div className="rounded-full bg-gradient-to-br from-brand-blue-500 to-brand-orange-400 p-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
        </div>

        <h2 className="mb-2 text-center text-xl font-semibold text-gray-900 dark:text-white">
          Admin Login
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter the admin password to access content management
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="Enter password"
            error={error}
            autoFocus
          />

          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onLogout}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Login
            </Button>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-500">
          Contact Applied AI Labs for password information
        </p>
      </div>
    </Modal>
  );
}