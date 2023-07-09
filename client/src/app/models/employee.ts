export interface Employee {
  // id:string;
  srNo?: number;
  name?: string;
  email: string;
  department?: string;
  profileImagePath?: string;
  time?: string;
}

export interface EmployeeLoginInfo {
  email: string;
  password: string;
}
