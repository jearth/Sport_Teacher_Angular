import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LeaderDetailDTO } from '../../model/LeaderDetail.model';
import { GeneralService } from '../../services/general.service';

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
  
  closeLeaderSearchModal(): void {
    this.dialogRef.close({
      leaderNo: '1234'
    });
  }
}
