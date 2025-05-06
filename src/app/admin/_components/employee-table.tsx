
'use client';

import type { Employee } from '@/types';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import QRCodeDisplay from '@/components/qr-code';
import { getBaseUrl } from '@/lib/data';
import { Check, X, Trash2, Edit, Eye } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger, DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  handleUpdateEmployeeStatus,
  handleDeleteEmployee,
  handleUpdateEmployeeDetails
} from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { useState, useTransition, useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';

interface EmployeeTableProps {
  employees: Employee[];
  // refreshEmployees prop removed
}

// Define state for the update details action
interface UpdateDetailsState {
  message: string | null;
  errors?: Record<string, string[] | undefined>;
  success?: boolean;
}

// Submit button for the Edit Details form
function EditSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}


export default function EmployeeTable({ employees }: EmployeeTableProps) {
  const { toast } = useToast();
  const [isPendingOther, startTransition] = useTransition(); // For status/delete
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const editFormRef = useRef<HTMLFormElement>(null); // Ref for edit form

  // State for the edit details action
  const initialUpdateState: UpdateDetailsState = { message: null, errors: {}, success: false };
  const [updateState, updateFormAction] = useActionState(handleUpdateEmployeeDetails, initialUpdateState);


  // Effect to handle toast messages for the edit form action result
  useEffect(() => {
    if (updateState?.message) {
       toast({
         title: updateState.success ? 'Success' : 'Error',
         description: updateState.message,
         variant: updateState.success ? 'default' : 'destructive',
       });
       if (updateState.success) {
         // refreshEmployees(); // This line is no longer needed as revalidatePath in actions handles it.
         setEditEmployee(null); // Close dialog on success
       }
    }
  }, [updateState, toast]);

  // --- Handlers for Status Update and Deletion ---
  const updateStatus = (id: string, status: Employee['status']) => {
    startTransition(async () => {
      const result = await handleUpdateEmployeeStatus(id, status);
      toast({
        title: result.success ? 'Success' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      // Revalidation is handled by the server action.
    });
  };

  const deleteEmployeeAction = (id: string) => {
    startTransition(async () => {
      const result = await handleDeleteEmployee(id);
      toast({
        title: result.success ? 'Success' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      // Revalidation is handled by the server action.
    });
  };

  // --- Render Logic ---
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>QR Code</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>
                <Badge
                  variant={employee.status === 'authorized' ? 'default' : 'destructive'}
                  className={employee.status === 'authorized' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  {employee.status === 'authorized' ? 'Authorized' : 'Unauthorized'}
                </Badge>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View QR Code</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>QR Code for {employee.name}</DialogTitle>
                      <DialogDescription>
                        Scan this code to check the employee's status.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center py-4">
                      <QRCodeDisplay
                        text={`${getBaseUrl()}/employee/${employee.id}`}
                        size={250}
                        alt={`QR Code for ${employee.name}`}
                      />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">Close</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell className="text-right space-x-1">
                 <Button variant="ghost" size="icon" onClick={() => setEditEmployee(employee)} disabled={isPendingOther}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit Employee</span>
                </Button>
                {employee.status === 'authorized' ? (
                  <Button variant="ghost" size="icon" title="Mark Unauthorized" onClick={() => updateStatus(employee.id, 'unauthorized')} disabled={isPendingOther}>
                    <X className="h-4 w-4 text-destructive" />
                     <span className="sr-only">Mark Unauthorized</span>
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" title="Mark Authorized" onClick={() => updateStatus(employee.id, 'authorized')} disabled={isPendingOther}>
                    <Check className="h-4 w-4 text-green-600" />
                     <span className="sr-only">Mark Authorized</span>
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" title="Delete Employee" disabled={isPendingOther}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                       <span className="sr-only">Delete Employee</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete <strong>{employee.name}</strong>. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isPendingOther}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteEmployeeAction(employee.id)} disabled={isPendingOther} className={buttonVariants({ variant: "destructive" })}>
                        {isPendingOther ? 'Deleting...' : 'Delete Permanently'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="outline" size="icon" title="View Status Page" asChild>
                  <Link href={`/employee/${employee.id}`} target="_blank">
                      <Eye className="h-4 w-4" />
                       <span className="sr-only">View Status Page</span>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editEmployee} onOpenChange={(isOpen) => !isOpen && setEditEmployee(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Employee Details</DialogTitle>
            <DialogDescription>
              Update information for {editEmployee?.name}. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>
          <form action={updateFormAction} ref={editFormRef} className="grid gap-4 py-4">
            <input type="hidden" name="id" value={editEmployee?.id || ''} />
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">Name</Label>
              <Input
                id="edit-name"
                name="name"
                defaultValue={editEmployee?.name || ''}
                className="col-span-3"
                required
                aria-describedby="edit-name-error"
              />
               {updateState?.errors?.name && (
                 <p id="edit-name-error" className="col-span-4 text-sm text-destructive text-right">{updateState.errors.name[0]}</p>
               )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-position" className="text-right">Position</Label>
              <Input
                id="edit-position"
                name="position"
                defaultValue={editEmployee?.position || ''}
                className="col-span-3"
                required
                 aria-describedby="edit-position-error"
              />
               {updateState?.errors?.position && (
                 <p id="edit-position-error" className="col-span-4 text-sm text-destructive text-right">{updateState.errors.position[0]}</p>
              )}
            </div>
            {updateState?.message && !updateState.success && !updateState.errors && (
              <p className="col-span-4 text-sm text-destructive text-center">{updateState.message}</p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={useFormStatus().pending}>Cancel</Button>
              </DialogClose>
              <EditSubmitButton />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { buttonVariants } from "@/components/ui/button";
