
export interface RegisterRequest{
  email:string;
  password: string;
  fullname?: string;
  roles?:string
}