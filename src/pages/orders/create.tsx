import { PageHeader } from "@/components/layout/page-header"

export default function CreateOrderPage() {
  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        heading="Create Order"
        description="Create a new customer order"
      />
      
      {/* Order form will be implemented here */}
      <div className="rounded-lg border p-4">
        <p className="text-muted-foreground">Order creation form coming soon</p>
      </div>
    </div>
  )
}