'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    children, 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false,
    disabled, 
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantStyles = {
      primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
      secondary: 'bg-secondary text-text-primary hover:bg-secondary-dark focus:ring-secondary',
      outline: 'bg-transparent border border-gray-300 text-text-secondary hover:bg-background-dark focus:ring-gray-300',
      destructive: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400',
    };
    
    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 rounded',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-6 py-3',
    };
    
    const widthStyles = fullWidth ? 'w-full' : '';
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
    
    const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${className || ''}`;
    
    return (
      <button 
        className={buttonClasses} 
        disabled={disabled} 
        ref={ref} 
        {...props}
      >
        {children}
      </button>
    );
  }
); 