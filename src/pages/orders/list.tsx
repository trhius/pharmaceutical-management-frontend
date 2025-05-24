import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/ui/data-table"

export default function OrdersListPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Orders"
        description="View and manage customer orders"
      />
      
      <DataTable 
        columns={[]}
        data={[]}
      />
    </div>
  )
}
