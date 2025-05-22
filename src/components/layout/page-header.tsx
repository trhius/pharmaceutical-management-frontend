import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  separator?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  separator = true,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {separator && <Separator className="mt-6" />}
    </div>
  );
}