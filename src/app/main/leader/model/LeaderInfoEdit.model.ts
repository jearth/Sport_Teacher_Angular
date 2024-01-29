import { Certificate } from "./Certificate.model";
import { School } from "./School.model";
import { Sport } from "./Sport.model";
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
