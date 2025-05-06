
export type EmployeeStatus = 'authorized' | 'unauthorized';

export interface Employee {
  id: string;
  name: string;
  position: string;
  status: EmployeeStatus;
}
