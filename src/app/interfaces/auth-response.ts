export interface AuthResponse {
  id: string,
  email:string,
  fullname?: string,
  dateofbirth?:string,
  gender?:number,
  role?:number,
  isemailverified: Boolean,
  isdoctorverified?:Boolean,
  isprofilesetupcomplete:Boolean,
  token:string
}
