import { Component } from '@angular/core';
import { LeaderSearchComponent } from '../../dialogs/leader-search/leader-search.component';
import { MatDialog } from '@angular/material/dialog';
import { SchoolSearchComponent } from '../../dialogs/school-search/school-search.component';
import { AlertComponent } from '../../../../utils/alert/alert.component';
import { AlertErrorComponent } from '../../../../utils/alert-error/alert-error.component';
import { LeaderInfoDetailDTO } from '../../model/LeaderInfoDetail.model';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../../services/general.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {
  leaderInfo: LeaderInfoDetailDTO = new LeaderInfoDetailDTO();

  constructor(private route: ActivatedRoute,
    private generalService: GeneralService,
    // private datePipe: DatePipe,
    public dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((param: any) => {
      this.generalService.getEdits(param.leaderNo).subscribe(
        (data: LeaderInfoDetailDTO) => {
          this.leaderInfo = data;
          console.log('전체 데이터:', this.leaderInfo);
        },
        (error) => {
          console.error('리더 정보를 가져오는 동안 오류가 발생했습니다.', error);
        }
      );
    });
  }

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
  openEditCancelModal(): void {
    const dialogRef = this.dialog.open(AlertComponent, {
      data: { title: '지도자 수정 취소',
              content: '지도자 수정을 취소하시겠습니까? <br> 작성한 내용은 모두 삭제됩니다.' }
    });
  }

  // 필수입력값 에러 모달창 열기
  openEditErrorModal(): void {
    const dialogRef = this.dialog.open(AlertErrorComponent, {
      data: { title: '필수입력값 확인',
              content: '필수입력값이 채워지지 않았습니다. <br> 확인후 채워주시기 바랍니다.' }
    });
  }

  // 지도자 등록 모달창 열기
  openEditSuccessModal(): void {
    // 유효성 검사
    let validateResult: boolean = false;
    
    // 유효성 검사를 만족하지 않으면, 필수입력값 에러 모달창 열기
    if (!validateResult) {
      this.openEditErrorModal();
    } else {
      const dialogRef = this.dialog.open(AlertComponent, {
        data: {
          title: '지도자 수정',
          content: '입력한 내용으로 지도자를 수정하시겠습니까?'
        }
      });
    }
  }
}
