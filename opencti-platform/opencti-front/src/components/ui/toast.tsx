import { Toaster as Sonner, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-elevated group-[.toaster]:text-text-base group-[.toaster]:border-border group-[.toaster]:rounded-[4px] group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-text-muted',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-white group-[.toast]:rounded-[4px]',
          cancelButton:
            'group-[.toast]:bg-surface-2 group-[.toast]:text-text-muted group-[.toast]:rounded-[4px]',
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
