export const StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

export const StrongEmailRegx: RegExp =
  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

