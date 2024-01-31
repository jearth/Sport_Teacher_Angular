import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LeaderDetailDTO } from '../../model/LeaderDetail.model';
import { GeneralService } from '../../services/general.service';
import { AlertErrorComponent } from '../../../../utils/alert-error/alert-error.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-leader-search',
  templateUrl: './leader-search.component.html',
  styleUrl: './leader-search.component.css'
})
export class LeaderSearchComponent {
  constructor(public dialogRef: MatDialogRef<LeaderSearchComponent>, private generalService: GeneralService, public dialog: MatDialog) {}

  leaderDetailDTO: LeaderDetailDTO = {};

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.generalService.getLeaderDetails().subscribe(
      (data: LeaderDetailDTO) => {
        this.leaderDetailDTO = data;
      },
      (error) => {
        console.error('HTTP 요청 에러:', error);
      }
    );    
  }
  
  searchName: string = '';

  searchLeadersName(): void {
    if (this.leaderDetailDTO && this.leaderDetailDTO.leaders && this.searchName.trim() !== '') {
      this.leaderDetailDTO.leaders = this.leaderDetailDTO.leaders.filter(
        (leader) => leader && leader.leaderName && leader.leaderName.includes(this.searchName.trim())
      );
    } else {
      this.loadData(); 
    }
  }

  selectedLeader: any;

  closeLeaderSearchModal(): void {
    this.generalService.setSelectedLeaderNo(this.selectedLeader);
    console.log('Selected Leader:', this.selectedLeader);

    this.dialogRef.close({
      LeaderNo: this.selectedLeader ? this.selectedLeader.leaderNo : null,
      LeaderName: this.selectedLeader ? this.selectedLeader.leaderName : null
    });
  }
  
  selectRow(leader: any): void {
    this.selectedLeader = leader;
  }
  
  registerLeaderSearchModal(): void {
    if (this.selectedLeader) {
      const selectedLeaderNo = this.selectedLeader.leaderNo;
      const selectedLeaderName = this.selectedLeader.leaderName;
      this.generalService.setSelectedLeaderNo(selectedLeaderNo);
      this.closeLeaderSearchModal();
    } else {
      this.openRegisterErrorLeaderSearchModal();
    }
  }

  // 선택된 식별 코드 없음 에러 모달창 열기
  openRegisterErrorLeaderSearchModal(): void {
    const dialogRef = this.dialog.open(AlertErrorComponent, {
      data: { title: '선택된 식별코드 없음',
              content: '선택된 지도자 식별코드가 없습니다. <br> 식별코드를 선택해주시기 바랍니다.' }
    });
  }

}
