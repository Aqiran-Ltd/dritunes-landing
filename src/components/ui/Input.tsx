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
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-xl
              bg-gray-50 dark:bg-gray-900 
              border-2 
              ${error 
                ? 'border-red-500 focus:border-red-600 focus:ring-red-200' 
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 focus:border-red-600 focus:ring-4 focus:ring-red-500/10'
              }
              transition-all duration-300 ease-out
              placeholder:text-gray-400 dark:placeholder:text-gray-600
              text-gray-900 dark:text-gray-100
              focus:outline-none focus:bg-white dark:focus:bg-black
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-11' : ''}
              ${isPassword ? 'pr-11' : ''}
              ${className}
            `}
            {...props}
            type={isPassword ? (showPassword ? 'text' : 'password') : props.type}
          />
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold-700 transition-colors duration-300">
              {icon}
            </div>
          )}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none transition-colors"
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
          <p className="text-xs text-red-500 ml-1 animate-slide-in-up">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
