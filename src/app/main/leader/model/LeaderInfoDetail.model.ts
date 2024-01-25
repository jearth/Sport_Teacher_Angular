import { Certificate } from "./Certificate.model";
import { Work } from "./Work.model";

export class LeaderInfoDetailDTO {
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
    work?: Work[];
    certificate?: Certificate[];
}
