import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { LeaderSearchComponent } from '../../Share/leader-search/leader-search.component';
import { SchoolSearchComponent } from '../../Share/school-search/school-search.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(public dialog: MatDialog) {}

  openLeaderSearchModal(): void {
    const dialogRef = this.dialog.open(LeaderSearchComponent);
  }

  openSchoolSearchModal(): void {
    const dialogRef = this.dialog.open(SchoolSearchComponent);
  }

  employmentHistory = [
    { WorkPlace: '', StartDT: '', EndDT: '', SportNo: '', buttonLabel: '추가' }
  ];
  
  addHistoryRow() {
    // 배열에 빈 문자열로 초기화된 행을 추가하고, 추가 버튼은 삭제 버튼으로 변경됨
    this.employmentHistory.push({ WorkPlace: '', StartDT: '', EndDT: '', SportNo: '', buttonLabel: '추가' });
  
    // length - 2는 현재 행이 배열의 맨 뒤에 추가되기 전의 마지막 행을 나타냄
    // 고로 prevIndex 이전 행의 인덱스
    const prevIndex = this.employmentHistory.length - 2;
    if (prevIndex >= 0) {
      // 이전 행이 존재하는 경우 이전 행의 버튼 속성을 삭제로 바꿈
      this.employmentHistory[prevIndex].buttonLabel = '삭제';
    }
  }
  
  deleteHistoryRow(index: number) {
    this.employmentHistory.splice(index, 1);
  }
  
}
