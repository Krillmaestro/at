// Button Component
// Usage: <Button variant="primary">Click me</Button>

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon = null,
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = 'btn';

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'bg-error text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  return (
    <button
      type={type}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${loading ? 'cursor-wait' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {icon && !loading && <span className="w-5 h-5">{icon}</span>}
      {children}
    </button>
  );
}
