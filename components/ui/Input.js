// Input Component
// Usage: <Input label="Email" type="email" />

import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`
          input
          ${error ? 'border-error focus:border-error focus:ring-error' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

// Textarea Component
export const Textarea = forwardRef(({
  label,
  error,
  className = '',
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          input resize-none
          ${error ? 'border-error focus:border-error focus:ring-error' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Select Component
export const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Select...',
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`
          input cursor-pointer
          ${error ? 'border-error focus:border-error focus:ring-error' : ''}
          ${className}
        `}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
