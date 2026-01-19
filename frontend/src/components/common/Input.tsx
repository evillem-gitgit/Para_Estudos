import { forwardRef } from 'react';
import type {InputHTMLAttributes} from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="label">{label}</label>}
        <input
          ref={ref}
          className={`input ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';