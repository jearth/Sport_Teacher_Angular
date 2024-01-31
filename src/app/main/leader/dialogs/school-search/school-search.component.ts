import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LeaderDetailDTO } from '../../model/LeaderDetail.model';
import { GeneralService } from '../../services/general.service';
import { AlertErrorComponent } from '../../../../utils/alert-error/alert-error.component';

@Component({
  selector: 'app-school-search',
  templateUrl: './school-search.component.html',
  styleUrl: './school-search.component.css'
})
export class SchoolSearchComponent {
  selectedSchool: any;
  leaderDetailDTO: LeaderDetailDTO = {};

  constructor(public dialogRef: MatDialogRef<SchoolSearchComponent>, private generalService: GeneralService, public dialog: MatDialog) {}

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
    } 
    else {
      this.loadData(); 
    }
  }

  closeSchoolSearchModal(): void {
    this.generalService.setSelectedSchoolNo(this.selectedSchool);
    this.dialogRef.close({
      SchoolName: this.selectedSchool ? this.selectedSchool.schoolName : null,
      SchoolNo: this.selectedSchool ? this.selectedSchool.schoolNo : null,
    });
  }

  selectRow(leader: any): void {
    this.selectedSchool = leader;
  }

  registerSchoolSearchModal(): void {
    if (this.selectedSchool) {
      const selectedSchoolName = this.selectedSchool.schoolName;
      this.generalService.setSelectedSchoolNo(selectedSchoolName);
      this.closeSchoolSearchModal();
    } else {
      this.openRegisterErrorSchoolSearchModal();
    }
  }

  // 선택된 식별 코드 없음 에러 모달창 열기
  openRegisterErrorSchoolSearchModal(): void {
    const dialogRef = this.dialog.open(AlertErrorComponent, {
      data: { title: '선택된 학교 없음',
              content: '선택된 학교명이 없습니다. <br> 학교명을 선택해주시기 바랍니다.' }
    });
  }
}