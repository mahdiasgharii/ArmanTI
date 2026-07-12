import { cn } from '../../lib/utils';

interface OverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
}

function Overlay({ className, open = true, ...props }: OverlayProps) {
  if (!open) return null;
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-black/50',
        className,
      )}
      {...props}
    />
  );
}

export { Overlay };
