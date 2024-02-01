import { Component } from '@angular/core';
import { LeaderSearchComponent } from '../../dialogs/leader-search/leader-search.component';
import { MatDialog } from '@angular/material/dialog';
import { SchoolSearchComponent } from '../../dialogs/school-search/school-search.component';
import { AlertComponent } from '../../../../utils/alert/alert.component';
import { AlertErrorComponent } from '../../../../utils/alert-error/alert-error.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../../services/general.service';
import { DatePipe } from '@angular/common';
import { LeaderInfoEditDTO } from '../../model/LeaderInfoEdit.model';
import { Conditional } from '@angular/compiler';
import moment from 'moment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {
  leaderInfo: LeaderInfoEditDTO = new LeaderInfoEditDTO();
  leaderEditInfo: LeaderInfoEditDTO = new LeaderInfoEditDTO();

  constructor(private route: ActivatedRoute,
    private generalService: GeneralService,
    public dialog: MatDialog,
    private router: Router) {}  

  ngOnInit(): void {
    this.route.queryParams.subscribe((param: any) => {
      this.generalService.getEdits(param.leaderNo).subscribe(
        (data: LeaderInfoEditDTO) => {
          data.birthday = moment(data.birthday).format('yyyy-MM-DD');
          data.empDT = moment(data.empDT).format('yyyy-MM-DD');

          if (data.work) {
            data.work.forEach(workformat => {
              workformat.startDT = moment(workformat.startDT).format('yyyy-MM-DD');
              workformat.endDT = moment(workformat.endDT).format('yyyy-MM-DD');
            });
          }

          if (data.certificate) {
            data.certificate.forEach(certificateformat => {
              certificateformat.certificateDT = moment(certificateformat.certificateDT).format('yyyy-MM-DD');
            });
          }

          this.leaderInfo = data;
          console.log('전체 수정 데이터:', this.leaderInfo);
        },
        (error) => {
          console.error('리더 정보를 가져오는 동안 오류가 발생했습니다.', error);
        }
      );
    });
  }
  
  openEditSuccessModal(): void {
    // 유효성 검사
    let validateResult: boolean = true;
    
    // 유효성 검사를 만족하지 않으면, 필수입력값 에러 모달창 열기
    if (!validateResult) {
      this.openEditErrorModal();
    } else {
      const dialogRef = this.dialog.open(AlertComponent, {
        data: {
          title: '지도자 등록',
          content: '입력한 내용으로 지도자를 등록하시겠습니까?'
        }
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if(result) this.edit();
      });
    }
  }

  edit() {
    this.leaderEditInfo = Object.assign({}, this.leaderInfo, { leaderNo: this.leaderInfo.leaderNo });
    this.leaderEditInfo.telNo = `${this.leaderEditInfo.tel1}-${this.leaderEditInfo.tel2}-${this.leaderEditInfo.tel3}`;
    this.generalService.editLeaders(this.leaderInfo.leaderNo, this.leaderEditInfo).subscribe(
      (result) => {
        console.log('수정 성공:', result);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('등록 실패:', error);
      }
    );
  }

  // 파일 내용을 읽어와서 base64 형태로 변환하여 leaderInfo.imageBase에 저장
  onFileChange(event: any): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.leaderInfo.imageBase = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
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
    { WorkPlace: '', StartDT: new Date(), EndDT: new Date(), SportNo: '', buttonLabel: '추가' }
  ];

  addHistoryRow() {
    const employmentHistory = {workPlace: '', startDT: null, endDT: null, sportName: ''};
    (this.leaderInfo!.work as any[]).push(employmentHistory);
  }

  deleteHistoryRow(index: number) {
    if (this.leaderInfo) {
        this.leaderInfo.work!.splice(index, 1);
    }
  }

  // 자격사항 테이블 추가
  certificateList = [
    { CertificateName: '', CertificateNumber: '', CertificateDT: new Date(), Origanization: '', buttonLabel: '추가' }
  ];

  addCertificateRow() {
    const certificateList = {workPlace: '', startDT: null, endDT: null, sportName: ''};
    (this.leaderInfo!.certificate as any[]).push(certificateList);
  }

  deleteCertificateRow(index: number) {
    if (this.leaderInfo) {
        this.leaderInfo.certificate!.splice(index, 1);
    }
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
}
