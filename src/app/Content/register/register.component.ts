import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { LeaderSearchComponent } from '../../Share/leader-search/leader-search.component';
import { SchoolSearchComponent } from '../../Share/school-search/school-search.component';
import { Leader } from '../../model/leader.model';
import { AlertComponent } from '../../utils/alert/alert.component';
import { AlertErrorComponent } from '../../utils/alert-error/alert-error.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
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

  // 지도자 등록 취소 모달창 열기
  openRegisterCancelModal(): void {
    const dialogRef = this.dialog.open(AlertComponent, {
      data: { title: '지도자 등록 취소',
              content: '지도자 등록을 취소하시겠습니까? <br> 작성한 내용은 모두 삭제됩니다.' }
    });
  }

  // 필수입력값 에러 모달창 열기
  openRegisterErrorModal(): void {
    const dialogRef = this.dialog.open(AlertErrorComponent, {
      data: { title: '필수입력값 확인',
              content: '필수입력값이 채워지지 않았습니다. <br> 확인후 채워주시기 바랍니다.' }
    });
  }

  // 지도자 등록 모달창 열기
  openRegisterSuccessModal(): void {
    // 유효성 검사
    let validateResult: boolean = false;
    
    if (!validateResult) {
      this.openRegisterErrorModal();
    } else {
      const dialogRef = this.dialog.open(AlertComponent, {
        data: {
          title: '지도자 등록',
          content: '입력한 내용으로 지도자를 등록하시겠습니까?'
        }
      });
    }
  }


// // 대충 적은 거
//   leader?: Leader;

//   register() {

//     // 서비스 코드 호출 후 leader 넘김
//   }
}
