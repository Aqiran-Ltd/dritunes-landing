import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = props.type === 'password';

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 ml-0.5">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-xl text-sm sm:text-base
              bg-gray-50 dark:bg-gray-900 
              border
              ${error 
                ? 'border-red-500 dark:border-red-500/80 focus:border-red-500 focus:ring-4 focus:ring-red-500/15 text-red-900 dark:text-red-200' 
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 focus:border-gold-500 dark:focus:border-gold-400 focus:ring-4 focus:ring-gold-500/15 dark:focus:ring-gold-500/20 text-gray-900 dark:text-white'
              }
              transition-all duration-200 ease-out
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              focus:outline-none focus:bg-white dark:focus:bg-gray-950
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-11' : ''}
              ${isPassword ? 'pr-11' : ''}
              ${className}
            `}
            {...props}
            type={isPassword ? (showPassword ? 'text' : 'password') : props.type}
          />
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold-700 dark:group-focus-within:text-gold-400 transition-colors duration-200 pointer-events-none">
              {icon}
            </div>
          )}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none transition-colors p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 dark:text-red-400 ml-1 font-medium animate-slide-in-up">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
