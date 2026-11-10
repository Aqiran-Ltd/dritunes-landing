'use client';

import React, { useCallback, useRef, useState } from 'react';
import { LockClosedIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ApiError } from '@/lib/api';

/** Thrown by `withPassword` when the user dismisses the password prompt. */
export class PasswordCancelledError extends Error {
  constructor() {
    super('Password confirmation cancelled');
  }
}

/** The backend answers 422 with an `errors.current_password` entry when it wants (or rejects) the password. */
function passwordIssue(err: unknown): string | null {
  if (!(err instanceof ApiError) || err.status !== 422) return null;
  const issue = err.data?.errors?.current_password;
  return Array.isArray(issue) && issue.length ? String(issue[0]) : null;
}

const MAX_ATTEMPTS = 3;

/**
 * Password confirmation for sensitive actions (payout accounts, withdrawals).
 *
 * The backend only asks for `current_password` when PAYOUT_REQUIRE_PASSWORD is on, so we never
 * prompt up front: the action runs without it, and only if the server asks do we show the
 * prompt and retry with the password. It works whether the flag is on or off.
 *
 *   const { withPassword, passwordModal } = usePasswordConfirm();
 *   await withPassword((pw) => requestWithdrawal(token, amount, id, pw), 'confirm this withdrawal');
 *   ...
 *   return <>{...}{passwordModal}</>;
 */
export function usePasswordConfirm() {
  const [prompt, setPrompt] = useState<{ reason: string; error?: string } | null>(null);
  const [value, setValue] = useState('');
  const resolver = useRef<((pw: string | null) => void) | null>(null);

  const ask = useCallback(
    (reason: string, error?: string) =>
      new Promise<string | null>((resolve) => {
        resolver.current = resolve;
        setValue('');
        setPrompt({ reason, error });
      }),
    []
  );

  const finish = (pw: string | null) => {
    resolver.current?.(pw);
    resolver.current = null;
    setPrompt(null);
    setValue('');
  };

  const withPassword = useCallback(
    async <T,>(action: (currentPassword?: string) => Promise<T>, reason: string): Promise<T> => {
      let password: string | undefined;
      for (let attempt = 0; ; attempt++) {
        try {
          return await action(password);
        } catch (err) {
          const issue = passwordIssue(err);
          if (issue === null || attempt >= MAX_ATTEMPTS) throw err;
          // First time: the server just asked. Later: the one we sent was rejected.
          const answer = await ask(reason, password === undefined ? undefined : issue);
          if (answer === null) throw new PasswordCancelledError();
          password = answer;
        }
      }
    },
    [ask]
  );

  const passwordModal = prompt ? (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="pw-confirm-title">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value) finish(value);
        }}
        className="relative w-full max-w-sm rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 shadow-2xl space-y-5"
      >
        <button type="button" onClick={() => finish(null)} aria-label="Cancel" className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full transition-colors">
          <XMarkIcon className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gold-500 text-ink">
            <LockClosedIcon className="w-5 h-5" />
          </div>
          <h3 id="pw-confirm-title" className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Confirm it&apos;s you</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Enter your password to {prompt.reason}.</p>
        <Input
          type="password"
          autoFocus
          autoComplete="current-password"
          maxLength={256}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Your password"
          error={prompt.error}
          className="rounded-2xl h-12"
        />
        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="outline" onClick={() => finish(null)}>Cancel</Button>
          <Button type="submit" disabled={!value}>Confirm</Button>
        </div>
      </form>
    </div>
  ) : null;

  return { withPassword, passwordModal };
}
