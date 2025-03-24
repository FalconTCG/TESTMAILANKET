'use client';

import { HTMLAttributes, useEffect, useRef, useState } from 'react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  error?: string;
  hint?: string;
}

interface SelectTriggerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  error?: boolean;
}

interface SelectValueProps {
  placeholder: string;
}

interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export const Select = ({ value, onValueChange, children, error, hint }: SelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      <div onClick={() => setOpen(!open)}>
        {children}
      </div>
      
      {hint && !error && (
        <p className="mt-1 text-xs text-text-light">{hint}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export const SelectTrigger = ({ className, children, error, ...props }: SelectTriggerProps) => {
  return (
    <div
      className={`flex items-center justify-between w-full px-4 py-2.5 text-text-primary bg-white border rounded-lg cursor-pointer transition-colors hover:border-gray-300
        ${error ? 'border-red-300' : 'border-gray-200'} 
        ${className || ''}`}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ml-2 text-text-light"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
};

export const SelectValue = ({ placeholder }: SelectValueProps) => {
  return <span className="text-text-secondary">{placeholder}</span>;
};

export const SelectContent = ({ className, children, ...props }: SelectContentProps) => {
  return (
    <div
      className={`absolute z-10 w-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-soft overflow-hidden animate-[fadeIn_0.15s_ease-in-out] ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const SelectItem = ({ className, children, value, ...props }: SelectItemProps) => {
  return (
    <div
      className={`px-4 py-2 text-text-primary cursor-pointer hover:bg-background transition-colors ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}; 