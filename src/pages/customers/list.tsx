import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddCustomerDialog } from './add-customer-dialog';
import { EditCustomerDialog } from './edit-customer-dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PageHeader } from '@/components/layout/page-header';
import { TableFilterSidebar } from './filter-customer';

// Dummy data for customers
const customersData = [
  {
    id: '1',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, New York, NY',
    type: 'retail',
    status: 'active',
    since: '2020-05-12',
  },
  {
    id: '2',
    name: 'James Miller',
    email: 'james.miller@example.com',
    phone: '(555) 234-5678',
    address: '456 Oak Ave, Chicago, IL',
    type: 'wholesale',
    status: 'active',
    since: '2021-08-19',
  },
  {
    id: '3',
    name: 'Olivia Taylor',
    email: 'olivia.taylor@example.com',
    phone: '(555) 345-6789',
    address: '789 Pine Rd, Los Angeles, CA',
    type: 'retail',
    status: 'active',
    since: '2022-02-28',
  },
  {
    id: '4',
    name: 'Noah Davis',
    email: 'noah.davis@example.com',
    phone: '(555) 456-7890',
    address: '101 Elm St, Miami, FL',
    type: 'retail',
    status: 'inactive',
    since: '2019-11-05',
  },
  {
    id: '5',
    name: 'Sophia Garcia',
    email: 'sophia.garcia@example.com',
    phone: '(555) 567-8901',
    address: '202 Maple Dr, Dallas, TX',
    type: 'wholesale',
    status: 'active',
    since: '2021-03-15',
  },
  {
    id: '6',
    name: 'Benjamin Martinez',
    email: 'benjamin.martinez@example.com',
    phone: '(555) 678-9012',
    address: '303 Cedar Ln, Seattle, WA',
    type: 'retail',
    status: 'active',
    since: '2020-09-22',
  },
  {
    id: '7',
    name: 'Isabella Rodriguez',
    email: 'isabella.rodriguez@example.com',
    phone: '(555) 789-0123',
    address: '404 Birch Rd, Boston, MA',
    type: 'retail',
    status: 'active',
    since: '2022-01-10',
  },
  {
    id: '8',
    name: 'Ethan Hernandez',
    email: 'ethan.hernandez@example.com',
    phone: '(555) 890-1234',
    address: '505 Spruce Ave, Denver, CO',
    type: 'wholesale',
    status: 'inactive',
    since: '2018-07-18',
  },
  {
    id: '9',
    name: 'Mia Lopez',
    email: 'mia.lopez@example.com',
    phone: '(555) 901-2345',
    address: '606 Willow St, Phoenix, AZ',
    type: 'retail',
    status: 'active',
    since: '2021-06-30',
  },
  {
    id: '10',
    name: 'Alexander Gonzalez',
    email: 'alexander.gonzalez@example.com',
    phone: '(555) 012-3456',
    address: '707 Redwood Dr, San Francisco, CA',
    type: 'wholesale',
    status: 'active',
    since: '2020-12-05',
  },
];

export default function CustomersListPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customersData[0] | null>(null);

  // In a real app, this would be a call to your API
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      // Simulate API call
      return new Promise<typeof customersData>((resolve) => {
        setTimeout(() => resolve(customersData), 500);
      });
    },
  });

  const handleEdit = (customer: typeof customersData[0]) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (customer: typeof customersData[0]) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }: any) => {
        const type = row.original.type;
        return (
          <Badge variant={type === 'wholesale' ? 'secondary' : 'outline'}>
            {type === 'wholesale' ? 'Wholesale' : 'Retail'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'since',
      header: 'Customer Since',
      cell: ({ row }: any) => {
        const date = new Date(row.original.since);
        return <span>{date.toLocaleDateString()}</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        return (
          <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
            {row.original.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
  ];

  const renderExpandedContent = (customer: typeof customersData[0]) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">Customer Details</h3>
            <div className="mt-2 space-y-2">
              <p><span className="text-muted-foreground">Name:</span> {customer.name}</p>
              <p><span className="text-muted-foreground">Position:</span> {customer.email}</p>
              <p><span className="text-muted-foreground">Branch:</span> {customer.phone}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="space-x-2">
              <Button variant="outline" onClick={() => navigator.clipboard.writeText(customer.id)}>
                Copy ID
              </Button>
              <Button variant="outline" onClick={() => handleEdit(customer)}>
                Edit Details
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDelete(customer)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      <PageHeader
        title="Customers"
        description="View and manage all customers"
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        }
      />

      <div className="flex min-h-screen items-start gap-8 py-8">
      <div className="sticky top-8">
        <TableFilterSidebar />
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Customers List</CardTitle>
          <CardDescription>
            Manage retail and wholesale customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={customers || []}
            searchKey="name"
            searchPlaceholder="Search customers..."
            expandedContent={renderExpandedContent}
          />
        </CardContent>
      </Card>
      </div>

      <AddCustomerDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      {selectedCustomer && (
        <EditCustomerDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          customer={selectedCustomer}
        />
      )}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Deactivate Customer"
        description={`Are you sure you want to deactivate ${selectedCustomer?.name}? They will no longer be able to place orders.`}
        confirmText="Deactivate"
        onConfirm={() => {
          // Handle deactivation
          setIsDeleteDialogOpen(false);
        }}
      />
    </div>
  );
}
