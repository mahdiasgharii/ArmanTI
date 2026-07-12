import * as React from 'react';
import { cn } from '../../lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, children, ...props }, ref) => {
    const [error, setError] = React.useState(false);
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex h-9 w-9 shrink-0 overflow-hidden rounded-[4px] bg-elevated',
          className,
        )}
        {...props}
      >
        {src && !error ? (
          <img
            src={src}
            alt={alt}
            className="aspect-square h-full w-full object-cover"
            onError={() => setError(true)}
          />
        ) : fallback ? (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-text-muted">
            {fallback}
          </div>
        ) : (
          children
        )}
      </div>
    );
  },
);
Avatar.displayName = 'Avatar';

export { Avatar };
