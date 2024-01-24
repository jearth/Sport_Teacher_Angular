import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LeaderDetailDTO } from '../../model/LeaderDetail.model';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-school-search',
  templateUrl: './school-search.component.html',
  styleUrl: './school-search.component.css'
})
export class SchoolSearchComponent {
  constructor(public dialogRef: MatDialogRef<SchoolSearchComponent>, private generalService: GeneralService, public dialog: MatDialog) {}

  closeSchoolSearchModal(bool: boolean): void {
    if(bool) return this.dialogRef.close('sc0001');
    return this.dialogRef.close();
  }

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

  searchSchool: string = '';

  searchSchoolName(): void {
    if (this.leaderDetailDTO && this.leaderDetailDTO.schools && this.searchSchool.trim() !== '') {
      this.leaderDetailDTO.schools = this.leaderDetailDTO.schools.filter(
        (leader) => leader && leader.schoolName && leader.schoolName.includes(this.searchSchool.trim())
      );
    } else {
      this.loadData(); 
    }  }
}