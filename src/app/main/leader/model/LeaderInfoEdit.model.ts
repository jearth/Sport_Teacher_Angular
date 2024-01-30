import { Certificate } from "./Certificate.model";
import { CertificateRegister } from "./Certificate.model";
import { School } from "./School.model";
import { Sport } from "./Sport.model";
import { WorkRegister } from "./Work.model";
import { Work } from "./Work.model";

export class LeaderInfoEditDTO {
    imageBase?: string;
    leaderNo?: string;
    leaderName?: string;
    sportName?: string;
    sportNo?: string;
    schoolName?: string;
    schoolNo?: string;
    birthday?: Date;
    gender?: string;
    telNo?: string;
    empDT?: Date;
    tel1?: string;
    tel2?: string;
    tel3?: string;
    work?: Work[];
    certificate?: Certificate[];
    sports?: Sport[];
    schools?: School[];
}

export class LeaderInfoDTO {
    ImageBase?: string;
    LeaderNo?: string;
    LeaderName?: string;
    SportName?: string;
    SportNo?: string;
    SchoolName?: string;
    SchoolNo?: string;
    Birthday?: Date;
    Gender?: string;
    TelNo?: string;
    tel1?: string;
    tel2?: string;
    tel3?: string;
    EmpDT?: Date;
    Work?: WorkRegister[];
    Certificate?: CertificateRegister[];
}