// Ensure no 'use client' directive is present at the top

import { getEmployees } from '@/lib/data'; // Server-side data fetching
import EmployeeTable from './_components/employee-table'; // Client Component
import AddEmployeeForm from './_components/add-employee-form'; // Client Component
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import type { Employee } from '@/types'; // Keep type import if needed elsewhere
// Removed Metadata import as it's handled in layout.tsx now

// Metadata is now handled in src/app/admin/layout.tsx

export default async function AdminPage() {
  // Fetch initial data on the server during rendering
  const initialEmployees = await getEmployees();

  // The refreshEmployeesPlaceholder function is removed as it's not needed
  // when using server actions and revalidatePath for updates.

  return (
    // Use a Fragment or a single top-level div if needed
    <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage employee access, view statuses, and generate QR codes.
        </p>

        {/* Add Employee Form Card */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle>Add New Employee</CardTitle>
             <CardDescription>Enter the details for the new employee below.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* AddEmployeeForm is a Client Component handling its own state */}
            <AddEmployeeForm />
          </CardContent>
        </Card>

        {/* Employee List Card */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle>Employee List</CardTitle>
             <CardDescription>View, edit, update status, or delete employees.</CardDescription>
          </CardHeader>
          <CardContent>
            {/*
              EmployeeTable is a Client Component. It receives initial server-fetched data.
              The refreshEmployees prop has been removed as revalidation handles updates.
            */}
            <EmployeeTable
              employees={initialEmployees}
            />
          </CardContent>
        </Card>
    </div>
  );
}
