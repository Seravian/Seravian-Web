export interface ChatDiagnosisDetailsDto {
  id: number;
  diagnosedProblem?: string;
  reasoning?: string;
  prescriptions?: string[];
  failureReason?: string;
  requestedAtUtc: string;
  completedAtUtc?: string;
}
