export interface Employee {
  // id:string;
  srNo?: number;
  name?: string;
  email: string;
  department?: string;
  location?: string;
  profileImagePath?: string;
  time?: string;
  gender:string;
}

export interface EmployeeLoginInfo {
  email: string;
  password: string;
}
