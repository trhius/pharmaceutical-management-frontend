import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UpdatePricesPage() {
  return (
    <div className="container mx-auto py-6 space-y-4">
      <PageHeader
        title="Update Prices"
        description="Update product prices in bulk"
      />

      <Card>
        <CardHeader>
          <CardTitle>Bulk Price Update</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="number"
              placeholder="Percentage change"
              className="max-w-[200px]"
            />
            <Button>Apply Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
