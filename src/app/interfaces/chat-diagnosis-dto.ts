// export interface ChatDiagnosisDto {
//   id: number;
//   requestedAtUtc: string;
//   completedAtUtc?: string;
// }

export interface ChatDiagnosisDto {
  id: number;
  diagnosedProblem?: string;
  failureReason?:string;
  requestedAtUtc: string;
  completedAtUtc?: string;
}
