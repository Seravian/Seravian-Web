export const StrongPasswordRegx: RegExp =
/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,100}$/;

export const StrongEmailRegx: RegExp =
  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

