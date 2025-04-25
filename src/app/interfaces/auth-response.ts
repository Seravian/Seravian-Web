import { Tokens } from "./tokens";

export interface AuthResponse {
  userId: string,
  email:string,
  fullName?: string,
  dateOfBirth?:string,
  gender?:number,
  role?:number,
  isEmailVerified: Boolean,
  isDoctorVerified?:Boolean,
  isProfileSetupComplete:Boolean,
  token:Tokens
}
