import { Component } from '@angular/core';
import { LeaderSearchComponent } from '../../Share/leader-search/leader-search.component';
import { MatDialog } from '@angular/material/dialog';
import { SchoolSearchComponent } from '../../Share/school-search/school-search.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {
  constructor(public dialog: MatDialog) {}

  // 식별코드 검색 모달창 열기
  openLeaderSearchModal(): void {
    const dialogRef = this.dialog.open(LeaderSearchComponent);
  }

  // 학교명 검색 모달창 열기
  openSchoolSearchModal(): void {
    const dialogRef = this.dialog.open(SchoolSearchComponent);
  }

  // 근무 이력 테이블 추가
  employmentHistory = [
    { WorkPlace: '', StartDT: '', EndDT: '', SportNo: '', buttonLabel: '추가' }
  ];
  
  addHistoryRow() {
    this.employmentHistory.push({ WorkPlace: '', StartDT: '', EndDT: '', SportNo: '', buttonLabel: '추가' });
  
    const HistoryIndex = this.employmentHistory.length - 1;
    if (HistoryIndex >= 0) {
      this.employmentHistory[HistoryIndex].buttonLabel = '삭제';
    }
  }

  // 근무 이력 테이블 삭제
  deleteHistoryRow(index: number) {
    this.employmentHistory.splice(index, 1);
  }
  
  // 자격사항 테이블 추가
  certificateList = [
    { CertificateName: '', CertificateNumber: '', CertificateDT: '', Origanization: '', buttonLabel: '추가' }
  ];

  addCertificateRow(){
    this.certificateList.push({ CertificateName: '', CertificateNumber: '', CertificateDT: '', Origanization: '', buttonLabel: '추가' });

    const CertificateIndex = this.certificateList.length -1;
    if (CertificateIndex >= 0) {
      this.certificateList[CertificateIndex].buttonLabel = '삭제';
    }
  }

  // 자격사항 테이블 삭제
  deleteCertificateRow(index: number) {
    this.certificateList.splice(index, 1);
  }
}
