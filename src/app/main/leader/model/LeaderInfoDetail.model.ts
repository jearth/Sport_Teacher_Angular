import { Certificate, CertificateDTO } from "./Certificate.model";
import { Work, WorkDetailDTO } from "./Work.model";

export class LeaderInfoDetailDTO {
    imageBase?: string;
    leaderNo?: string;
    leaderName?: string;
    sportName?: string;
    sportNo?: string;
    schoolName?: string;
    schoolNo?: string;
    birthday?: Date | string;
    gender?: string;
    telNo?: string;
    empDT?: Date| string;
    tel1?: string;
    tel2?: string;
    tel3?: string;
    work?: Work[];
    certificate?: Certificate[];
}
