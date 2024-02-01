import { Component } from '@angular/core';
import { LeaderInfoDetailDTO } from '../../model/LeaderInfoDetail.model';
import { GeneralService } from '../../services/general.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  providers: [DatePipe]
})
export class DetailComponent {
  leaderInfo: LeaderInfoDetailDTO = new LeaderInfoDetailDTO();

  constructor(private route: ActivatedRoute,
    private generalService: GeneralService,
    private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((param: any) => {
      this.generalService.getDetails(param.leaderNo).subscribe(
        (data: LeaderInfoDetailDTO) => {
          this.leaderInfo = data;
          console.log('전체 디테일 데이터:', this.leaderInfo);
        },
        (error) => {
          console.error('리더 정보를 가져오는 동안 오류가 발생했습니다.', error);
        }
      );
    });
  }
}
