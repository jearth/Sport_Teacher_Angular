import { LeaderDTO } from "./Leader.model";
import { School } from "./School.model";
import { Sport } from "./Sport.model";

export class LeaderDetailDTO {
    leaders?: LeaderDTO[];
    schools?: School[];
    sports?: Sport[];
}