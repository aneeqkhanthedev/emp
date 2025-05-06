
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { handleAddEmployee } from '@/lib/actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from 'lucide-react';

// Define the expected state shape for the action
interface AddEmployeeState {
  message: string | null;
  errors?: Record<string, string[] | undefined>;
  success?: boolean;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} disabled={pending}>
      <PlusCircle className="mr-2 h-4 w-4" />
      {pending ? 'Adding...' : 'Add Employee'}
    </Button>
  );
}

export default function AddEmployeeForm() {
  const initialState: AddEmployeeState = { message: null, errors: {}, success: false };
  // Correctly use useActionState with the action and initial state
  const [state, formAction] = useActionState(handleAddEmployee, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

   useEffect(() => {
    // Check for the presence of a message from the action state
    if (state?.message) {
        if (state.success) {
            toast({
                title: "Success",
                description: state.message,
            });
            formRef.current?.reset(); // Reset form on success
            // No need to manually reset state here, useActionState handles updates
        } else {
            // Handle errors, including validation errors
            let description = state.message;
            if (state.errors) {
                // Optionally format validation errors for display
                const errorMessages = Object.values(state.errors).flat().join(', ');
                description = `${state.message} ${errorMessages ? `Errors: ${errorMessages}`: ''}`;
            }
             toast({
                title: "Error",
                description: description,
                variant: "destructive",
            });
        }
    }
   }, [state, toast]); // Depend on the state object

  // Pass the formAction to the form's action prop
  return (
    <form action={formAction} ref={formRef} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Employee Name</Label>
          <Input id="name" name="name" required aria-describedby="name-error" />
          {state?.errors?.name && (
            <p id="name-error" className="text-sm text-destructive mt-1">{state.errors.name[0]}</p>
          )}
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Input id="position" name="position" required aria-describedby="position-error" />
           {state?.errors?.position && (
            <p id="position-error" className="text-sm text-destructive mt-1">{state.errors.position[0]}</p>
          )}
        </div>
      </div>
       <SubmitButton />
       {/* Optionally display a general non-field error message */}
       {/* {state?.message && !state.success && !state.errors && (
           <p className="text-sm text-destructive mt-2">{state.message}</p>
       )} */}
    </form>
  );
}
