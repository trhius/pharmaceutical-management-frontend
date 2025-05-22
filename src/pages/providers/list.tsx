import { PageHeader } from '@/components/layout/page-header';

export default function ProvidersListPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader title="Providers" description="Manage your providers and their information." />

      {/* Provider list content will go here */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <p className="text-sm text-muted-foreground">No providers found.</p>
        </div>
      </div>
    </div>
  );
}
