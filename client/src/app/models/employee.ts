export interface Employee {
  // id:string;
  name?: string;
  email: string;
  department?: string;
  profileImagePath?: string;
}

export interface EmployeeLoginInfo {
  email: string;
  password: string;
}
