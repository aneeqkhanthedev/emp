import { db } from './firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp, // Import Timestamp if storing dates
} from 'firebase/firestore';
import type { Employee, EmployeeStatus } from '@/types';
import { v4 as uuidv4 } from 'uuid'; // Keep uuid for potential client-side ID generation if needed before saving, though Firestore auto-IDs are preferred.


// Firestore collection reference
const employeesCollectionRef = collection(db, 'employees');

export async function getEmployees(): Promise<Employee[]> {
  try {
    // Query employees, order by name for consistency
    const q = query(employeesCollectionRef, orderBy('name'));
    const querySnapshot = await getDocs(q);
    const employees: Employee[] = [];
    querySnapshot.forEach((doc) => {
      // Important: Extract data and add the document ID
      employees.push({ id: doc.id, ...doc.data() } as Employee);
    });
    return employees;
  } catch (error) {
    console.error("Error fetching employees: ", error);
    // In a real app, you might want to throw the error or handle it differently
    return []; // Return empty array on error
  }
}

export async function getEmployeeById(id: string): Promise<Employee | undefined> {
   if (!id) return undefined; // Prevent Firestore error with empty ID
   try {
    const docRef = doc(db, 'employees', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Employee;
    } else {
      // doc.data() will be undefined in this case
      console.log(`No employee found with ID: ${id}`);
      return undefined;
    }
  } catch (error) {
     console.error(`Error fetching employee ${id}: `, error);
     return undefined;
  }
}

export async function addEmployee(name: string, position: string): Promise<Employee | null> {
   try {
    const newEmployeeData = {
      name,
      position,
      status: 'authorized' as EmployeeStatus, // Default status
      // You might want to add a createdAt timestamp
      // createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(employeesCollectionRef, newEmployeeData);
    // Return the newly created employee object with its Firestore ID
    return { id: docRef.id, ...newEmployeeData };
  } catch (error) {
    console.error("Error adding employee: ", error);
    return null; // Indicate failure
  }
}

export async function updateEmployeeStatus(id: string, status: EmployeeStatus): Promise<Employee | undefined> {
   if (!id) return undefined;
   try {
    const docRef = doc(db, 'employees', id);
    await updateDoc(docRef, { status: status });
    // Fetch the updated document to return it (optional, could also return true/void)
    const updatedDoc = await getDoc(docRef);
    return updatedDoc.exists() ? { id: updatedDoc.id, ...updatedDoc.data() } as Employee : undefined;
  } catch (error) {
    console.error(`Error updating status for employee ${id}: `, error);
    return undefined;
  }
}

export async function updateEmployeeDetails(id: string, name: string, position: string): Promise<Employee | undefined> {
   if (!id) return undefined;
   try {
    const docRef = doc(db, 'employees', id);
    await updateDoc(docRef, {
      name: name,
      position: position,
      // You might want to add an updatedAt timestamp
      // updatedAt: Timestamp.now(),
    });
     // Fetch the updated document to return it (optional, could also return true/void)
    const updatedDoc = await getDoc(docRef);
    return updatedDoc.exists() ? { id: updatedDoc.id, ...updatedDoc.data() } as Employee : undefined;
  } catch (error) {
     console.error(`Error updating details for employee ${id}: `, error);
     return undefined;
  }
}

export async function deleteEmployee(id: string): Promise<boolean> {
  if (!id) return false;
   try {
    const docRef = doc(db, 'employees', id);
    await deleteDoc(docRef);
    return true; // Indicate success
  } catch (error) {
     console.error(`Error deleting employee ${id}: `, error);
     return false; // Indicate failure
  }
}


// Helper to get the base URL - important for QR code generation
// This remains unchanged as it depends on environment variables, not Firebase directly.
export function getBaseUrl() {
  // Prefer NEXT_PUBLIC_BASE_URL if set (can be manually set for different environments)
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  // Fallback to Vercel URL if deployed on Vercel
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  // Assume localhost for local development as a final fallback
  return 'http://localhost:9002';
}
