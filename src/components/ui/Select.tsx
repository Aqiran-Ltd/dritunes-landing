'use client';

import React, { useState, useMemo } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition, Portal } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectOption {
  id: string | number;
  name: string;
  icon?: React.ReactNode;
  description?: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: SelectOption | null;
  onChange: (value: SelectOption) => void;
  placeholder?: string;
  searchable?: boolean;
  error?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  searchable = false,
  error,
  className = '',
  icon: leadingIcon,
}: SelectProps) {
  const [query, setQuery] = useState('');

  const filteredOptions = useMemo(() => {
    if (!query) return options;
    return options.filter((option) =>
      option.name.toLowerCase().includes(query.toLowerCase()) ||
      option.description?.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query]);

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
          {label}
        </label>
      )}

      <Listbox value={value ?? undefined} onChange={onChange}>
        <div className="relative">
          <ListboxButton
            className={`
              relative w-full cursor-pointer rounded-2xl py-3 pl-4 pr-10 text-left
              bg-gray-50 dark:bg-gray-900 
              border-2 transition-all duration-300 ease-out
              ${error 
                ? 'border-red-500 focus:ring-red-200' 
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 focus:ring-4 focus:ring-red-500/10'
              }
              focus:outline-none focus:border-red-600 focus:bg-white dark:focus:bg-black
              sm:text-sm
              ${leadingIcon ? 'pl-11' : ''}
            `}
          >
            {leadingIcon && (
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                {leadingIcon}
              </span>
            )}
            <span className="block truncate text-gray-900 dark:text-gray-100">
              {value ? value.name : <span className="text-gray-400 dark:text-gray-600">{placeholder}</span>}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </ListboxButton>

          <Transition
            as={React.Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Portal>
                <ListboxOptions 
                anchor="bottom start"
                className="z-[9999] mt-2 max-h-60 w-[var(--button-width)] overflow-auto rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl py-1 text-base shadow-2xl ring-1 ring-black/5 focus:outline-none sm:text-sm border border-gray-100 dark:border-gray-800 custom-scrollbar"
                >
                {searchable && (
                    <div className="sticky top-0 z-10 bg-white/50 dark:bg-black/50 backdrop-blur-md px-2 py-2 border-b border-gray-100 dark:border-gray-800">
                    <div className="relative">
                        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                        className="w-full rounded-xl border-none bg-gray-100 dark:bg-gray-800 py-2 pl-9 pr-4 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500/50 outline-none"
                        placeholder="Search..."
                        autoComplete="off"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        />
                    </div>
                    </div>
                )}

                <div className="p-1">
                    {filteredOptions.length === 0 ? (
                    <div className="relative cursor-default select-none py-4 px-4 text-center text-gray-500 italic">
                        Nothing found.
                    </div>
                    ) : (
                    filteredOptions.map((option) => (
                        <ListboxOption
                        key={option.id}
                        className={({ active, selected }) =>
                            `relative cursor-pointer select-none py-3 pl-10 pr-4 rounded-xl transition-all duration-200 ${
                            active ? 'bg-red-50 dark:bg-red-900/10 text-red-600' : 'text-gray-900 dark:text-gray-300'
                            } ${selected ? 'font-semibold' : 'font-normal'}`
                        }
                        value={option}
                        >
                        {({ selected, active }) => (
                            <>
                            <div className="flex items-center gap-3">
                                {option.icon && (
                                <span className={`transition-colors ${active ? 'text-red-600' : 'text-gray-400'}`}>
                                    {option.icon}
                                </span>
                                )}
                                <div className="flex flex-col">
                                <span className="block truncate">{option.name}</span>
                                {option.description && (
                                    <span className={`text-[10px] truncate ${active ? 'text-red-500/70' : 'text-gray-500'}`}>
                                    {option.description}
                                    </span>
                                )}
                                </div>
                            </div>

                            {selected ? (
                                <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active ? 'text-red-600' : 'text-red-600'
                                }`}
                                >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                            ) : null}
                            
                            {active && (
                                <motion.div 
                                layoutId="active-bg"
                                className="absolute inset-0 bg-red-600/5 dark:bg-red-600/10 rounded-xl -z-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                />
                            )}
                            </>
                        )}
                        </ListboxOption>
                    ))
                    )}
                </div>
                </ListboxOptions>
            </Portal>
          </Transition>
        </div>
      </Listbox>

      {error && (
        <p className="text-xs text-red-500 ml-1 animate-slide-in-up">
          {error}
        </p>
      )}
    </div>
  );
}
