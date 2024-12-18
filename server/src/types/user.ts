export interface User {
  id: string;
  email: string;
  password: string; // Hashed password
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {}
export interface LoginDto {
  email: string;
  password: string;
}
