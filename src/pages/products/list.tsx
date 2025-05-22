import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { TableFilterSidebar } from './filter-product';

export default function ProductsListPage() {
  return (
    <div className="container mx-auto py-6 space-y-4">
      <PageHeader
        heading="Products"
        description="Manage your product catalog"
        action={
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        }
      />

      <div className="flex min-h-screen items-start gap-8 py-8">
        <div>
          <TableFilterSidebar />
        </div>
        <div className="w-full">
      <DataTable
        columns={[
          {
            accessorKey: "name",
            header: "Name"
          },
          {
            accessorKey: "price",
            header: "Price"
          },
          {
            accessorKey: "stock",
            header: "Stock"
          }
        ]}
        data={[]}
      />
        </div>
      </div>
    </div>
  );
}
