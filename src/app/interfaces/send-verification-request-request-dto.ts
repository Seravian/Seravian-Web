import { DocotorTitle } from "./doctor-title.enum";

export interface SendVerificationRequestRequestDto {
  title : DocotorTitle
  description : string
  sessionPrice : number
  attachments : File[]
}
