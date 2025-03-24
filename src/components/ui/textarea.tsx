'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, hint, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={`w-full px-4 py-2.5 text-text-primary bg-white border rounded-lg min-h-[100px] transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent
            ${error ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'}
            ${className || ''}`}
          ref={ref}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1 text-xs text-text-light">{hint}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
); 