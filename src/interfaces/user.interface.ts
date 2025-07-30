export interface UserPayload {
  id: number;
  email: string;
  name: string;
}

export interface CreateUserDto {
  full_name: string;
  email: string;
}

export interface LoginUserDto {
  email: string;
}
