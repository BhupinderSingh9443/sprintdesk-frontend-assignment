import {
  useState,
} from 'react';

import type {
  FormEvent,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  isAxiosError,
} from 'axios';

import {
  useLogin,
} from '../features/auth/useLogin';

export default function LoginPage() {
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const [username, setUsername] =
    useState('');

  const [password, setPassword] =
    useState('');

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      await loginMutation.mutateAsync({
        username,
        password,
      });

      navigate(
        '/dashboard',
        {
          replace: true,
        },
      );
    } catch {
      // Error displayed through mutation state.
    }
  }

  let errorMessage: string | null = null;

  if (loginMutation.error) {
    if (isAxiosError(loginMutation.error)) {
      errorMessage =
        loginMutation.error.response?.data?.message ??
        'Unable to sign in.';
    } else {
      errorMessage =
        'Unable to sign in.';
    }
  }

  return (
    <main
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-slate-50
        px-4
      "
    >
      <section
        className="
          w-full
          max-w-md
          rounded-xl
          bg-white
          p-8
          shadow-sm
        "
      >
        <h1 className="text-2xl font-semibold text-slate-900">
          Sign in to SprintDesk
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Enter your credentials to continue.
        </p>

        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="username"
              className="
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              className="
                mt-2
                w-full
                rounded-lg
                border
                border-slate-300
                px-3
                py-2
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="
                mt-2
                w-full
                rounded-lg
                border
                border-slate-300
                px-3
                py-2
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="
                text-sm
                text-red-600
              "
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="
              w-full
              rounded-lg
              bg-blue-600
              px-4
              py-2.5
              font-medium
              text-white
              transition
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loginMutation.isPending
              ? 'Signing in...'
              : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}