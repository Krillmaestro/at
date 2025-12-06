// Card Component
// Usage: <Card hover>Content</Card>

export default function Card({
  children,
  className = '',
  hover = false,
  padding = true,
  onClick,
  ...props
}) {
  return (
    <div
      className={`
        ${hover ? 'card-hover' : 'card'}
        ${!padding ? 'p-0' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

// Card Header
export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

// Card Title
export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-text-primary ${className}`}>
      {children}
    </h3>
  );
}

// Card Description
export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-text-secondary mt-1 ${className}`}>
      {children}
    </p>
  );
}

// Card Content
export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

// Card Footer
export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-border-color ${className}`}>
      {children}
    </div>
  );
}
