export type Role = "Student" | "Employee" | "Admin";

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  year: number;
  category: string;
  status: "Available" | "Borrowed" | "Reserved";
  imageUrl?: string;
}

export interface StudentProfile {
  name: string;
  rollNumber: string;
  branch: string;
}

export interface EmployeeProfile {
  name: string;
  employeeId: string;
  department: string;
  position: string;
}

export interface AdminProfile {
  name: string;
  adminLevel: string;
  permissions: string[];
}

export interface ResearchNode {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stat1: { label: string; value: string };
  stat2: { label: string; value: string };
  progress: number;
  members: number;
  status: string;
  statusLabel: string;
}

export interface User {
  role: Role;
  profile: StudentProfile | EmployeeProfile | AdminProfile;
}
