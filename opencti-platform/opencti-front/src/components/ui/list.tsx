import * as React from 'react';
import { cn } from '../../lib/utils';

const List = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-col', className)}
    {...props}
  />
));
List.displayName = 'List';

const ListItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      'flex items-center gap-2 px-3 py-2 text-sm text-text-base transition-colors',
      'hover:bg-elevated focus:bg-elevated outline-none cursor-default',
      'lowercase first-letter:uppercase',
      className,
    )}
    {...props}
  />
));
ListItem.displayName = 'ListItem';

export { List, ListItem };
