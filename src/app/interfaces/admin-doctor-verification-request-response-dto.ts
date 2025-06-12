import { DoctorRequestStatus } from "./doctor-request-status.enum"
import { DocotorTitle } from "./doctor-title.enum"
import { DoctorVerificationRequestAttachmentDto } from "./doctor-verification-request-attachment-dto"

export interface AdminDoctorVerificationRequestResponseDto {
  id : number
  doctorId : string
  doctorFullName : string
  doctorEmail : string
  dateOfBirth : string
  doctorGender : boolean
  requestedAtUtc : string
  status : DoctorRequestStatus
  title : DocotorTitle
  description : string
  deletedAtUtc? : string
  reviewedAtUtc? : string
  doctorImageUrl : string
  attachments : DoctorVerificationRequestAttachmentDto[]
  rejectionNotes? : string
  reviewerId : string
}
