'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { addEmployee, updateEmployeeStatus, deleteEmployee, updateEmployeeDetails } from './data';
import type { EmployeeStatus } from '@/types';

const EmployeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  position: z.string().min(1, 'Position is required'),
});

// Define a return type for actions for better type safety
type ActionResponse = {
  message: string;
  errors?: Record<string, string[] | undefined>;
  success?: boolean;
};


export async function handleAddEmployee(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
  const validatedFields = EmployeeSchema.safeParse({
    name: formData.get('name'),
    position: formData.get('position'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Employee.',
      success: false,
    };
  }

  const { name, position } = validatedFields.data;

  try {
    const newEmployee = await addEmployee(name, position);
    if (!newEmployee) {
        throw new Error('Failed to add employee in database.');
    }
  } catch (error) {
    console.error('Add Employee Action Error:', error);
    return {
      message: 'Database Error: Failed to Create Employee.',
      success: false,
    };
  }

  revalidatePath('/admin'); // Revalidate the admin page to show the new employee
  return { message: 'Employee added successfully.', success: true };
}

export async function handleUpdateEmployeeStatus(id: string, status: EmployeeStatus): Promise<ActionResponse> {
  try {
    const updatedEmployee = await updateEmployeeStatus(id, status);
    if (!updatedEmployee) {
       return { message: 'Employee not found or failed to update.', success: false };
    }
    revalidatePath('/admin'); // Revalidate admin page
    revalidatePath(`/employee/${id}`); // Revalidate employee status page
    return { message: `Success: Employee status updated to ${status}.`, success: true };
  } catch (error) {
     console.error('Update Status Action Error:', error);
     return { message: 'Database Error: Failed to Update Employee Status.', success: false };
  }
}

export async function handleDeleteEmployee(id: string): Promise<ActionResponse> {
  try {
    const deleted = await deleteEmployee(id);
     if (!deleted) {
      return { message: 'Employee not found or failed to delete.', success: false };
    }
    revalidatePath('/admin');
    return { message: 'Success: Employee deleted successfully.', success: true };
  } catch (error) {
     console.error('Delete Employee Action Error:', error);
     return { message: 'Database Error: Failed to Delete Employee.', success: false };
  }
}

const UpdateEmployeeDetailsSchema = z.object({
  id: z.string().min(1, 'Employee ID is missing'), // Ensure ID is present and not empty
  name: z.string().min(1, 'Name is required'),
  position: z.string().min(1, 'Position is required'),
});

export async function handleUpdateEmployeeDetails(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
  const validatedFields = UpdateEmployeeDetailsSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    position: formData.get('position'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or Invalid Fields. Failed to Update Employee.',
      success: false,
    };
  }

  const { id, name, position } = validatedFields.data;

  try {
    const updatedEmployee = await updateEmployeeDetails(id, name, position);
    if (!updatedEmployee) {
       return { message: 'Employee not found or failed to update details.', success: false };
    }
    revalidatePath('/admin');
    revalidatePath(`/employee/${id}`);
    return { message: 'Success: Employee details updated successfully.', success: true };
  } catch (error) {
    console.error('Update Details Action Error:', error);
    return { message: 'Database Error: Failed to Update Employee Details.', success: false };
  }
}
