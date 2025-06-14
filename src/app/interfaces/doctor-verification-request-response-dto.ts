import { DoctorRequestStatus } from "./doctor-request-status.enum"
import { DocotorTitle } from "./doctor-title.enum"
import { DoctorVerificationRequestAttachmentDto } from "./doctor-verification-request-attachment-dto"

export interface DoctorVerificationRequestResponseDto {
  id : number
  requestedAtUtc : string
  attachments : DoctorVerificationRequestAttachmentDto[]
  status : DoctorRequestStatus
  doctorTitle : DocotorTitle
  description : string
  sessionPrice : number
  deletedAtUtc? : string
  reviewedAtUtc? : string
  rejectionNotes? : string
}
