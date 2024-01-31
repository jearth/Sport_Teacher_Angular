import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LeaderSearchComponent } from '../../dialogs/leader-search/leader-search.component';
import { SchoolSearchComponent } from '../../dialogs/school-search/school-search.component';
import { AlertComponent } from '../../../../utils/alert/alert.component';
import { AlertErrorComponent } from '../../../../utils/alert-error/alert-error.component';
import { GeneralService } from '../../services/general.service';
import { LeaderDetailDTO } from '../../model/LeaderDetail.model';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaderInfoDTO } from '../../model/LeaderInfoEdit.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {

  Gender: string = 'M';

  leaderInfoDTO: LeaderInfoDTO = {
    ImageBase: '',
    LeaderNo: '',
    LeaderName: '',
    SchoolNo: '',
    Birthday: new Date(),
    Gender: this.Gender,
    SportNo: '',
    TelNo: '',
    EmpDT: new Date(),

    Work: [
      { WorkPlace: '', StartDT: new Date(), EndDT: new Date(), SportNo: '' }
    ],
    Certificate: [
      { CertificateName: '', CertificateNumber: '', CertificateDT: new Date(), Origanization: '' }
    ]
  };

  
  employmentHistory: any[] = [{
    WorkPlace: '',
    StartDT: new Date(),
    EndDT: new Date(),
    SportNo: '',
    buttonLabel: '추가'
  }];

  certificateList = [{
    CertificateName: '',
    CertificateNumber: '',
    CertificateDT: '',
    Origanization: '',
    buttonLabel: '추가'
  }];

  leaderDetailDTO: LeaderDetailDTO = {};
  leaderNoValue: string | undefined;
  leaderNameValue: string | undefined;
  schoolNameValue: string | undefined;
  schoolNoValue: string | undefined;

  selectedImage: File | null = null;
  selectedImageUrl: string | null = null;

  tel1: string = '';
  tel2: string = '';
  tel3: string = '';


  constructor(private generalService: GeneralService,
              public dialog: MatDialog,
              private http: HttpClient,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.generalService.getLeaderDetails().subscribe(
      (data: LeaderDetailDTO) => {
        console.log('서버 응답:', data);
        this.leaderDetailDTO = data;
      },
      (error) => {
        console.error('HTTP 요청 에러:', error);
      }
    );    
  }

  leaderData: LeaderInfoDTO = this.leaderInfoDTO;
  // 지도자 등록 모달창 열기
  openRegisterSuccessModal(): void {
    this.leaderData = this.leaderInfoDTO;

    // 유효성 검사
    let validateResult: boolean = true;
    
    // 유효성 검사를 만족하지 않으면, 필수입력값 에러 모달창 열기
    if (!validateResult) {
      this.openRegisterErrorModal();
    } else {
      const dialogRef = this.dialog.open(AlertComponent, {
        data: {
          title: '지도자 등록',
          content: '입력한 내용으로 지도자를 등록하시겠습니까?'
        }
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if(result) this.register();
      });
    }
  }

  
  register() {
    this.generalService.postLeaders(this.leaderData).subscribe(
      (result) => {
        console.log('등록 성공:', result);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('등록 실패:', error);
      }
    );
  }

  // 이미지 등록
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    const maxSize = 1024 * 1024;
    if (file.size > maxSize) {
      this.openImageErrorModal();
      return;
    }

    this.selectedImage = file;
    
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImageUrl = e.target.result;
      this.leaderInfoDTO.ImageBase = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // 전화번호 업데이트
  // updateTelNo() {
  //   this.leaderInfoDTO.TelNo = `${this.leaderInfoDTO.tel1}${this.leaderInfoDTO.tel2}${this.leaderInfoDTO.tel3}`;
  // }

  calculateTelNo() {
    const tel1 = this.trimAndValidate(this.tel1);
    const tel2 = this.trimAndValidate(this.tel2);
    const tel3 = this.trimAndValidate(this.tel3);
  
    if (tel1 && tel2 && tel3) {
      this.leaderInfoDTO.TelNo = `${tel1}-${tel2}-${tel3}`;
    }
  }

  trimAndValidate(value: string): string {
    const trimmedValue = value.trim();

    if (/^\d+$/.test(trimmedValue)) {
      return trimmedValue;
    } else {
      // 숫자가 아닌 경우 빈 문자열 반환
      return '';
    }
  }


  // 근무 이력 테이블 추가
  addHistoryRow() {
    this.leaderInfoDTO.Work!.push({ WorkPlace: '', StartDT: new Date(), EndDT: new Date(), SportNo: '' });
  }

  // 근무 이력 테이블 삭제
  deleteHistoryRow(index: number) {
    this.leaderInfoDTO.Work!.splice(index, 1);
  }
  
  // 자격사항 테이블 추가
  addCertificateRow() {
    this.leaderInfoDTO.Certificate!.push({ CertificateName: '', CertificateNumber: '', CertificateDT: new Date(), Origanization: '' });
  }

  // 자격사항 테이블 삭제
  deleteCertificateRow(index: number) {
    this.leaderInfoDTO.Certificate!.splice(index, 1);
  }

  validateDates(index: number): boolean {
    const work = this.leaderInfoDTO.Work![index];
    const startDt = work.StartDT;
    const endDt = work.EndDT;

    if (startDt && endDt) {
      if (startDt > endDt) {
        this.openStartErrorModal();
        return false;
      }
    }

    return true;
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

  // 필수입력값 에러 모달창 열기
  openImageErrorModal(): void {
    const dialogRef = this.dialog.open(AlertErrorComponent, {
      data: { title: '이미지 등록 확인',
              content: '파일 크기는 MB 이하로 등록해주세요.' }
    });
  }

  // 근무 시작일 에러 모달창 열기
  openStartErrorModal(): void {
    const dialogRef = this.dialog.open(AlertErrorComponent, {
      data: { title: '근무 시작일 확인',
              content: '근무 시작일은 근무 종료일보다 빠를 수 없습니다!' }
    });
  }

  // 식별코드 검색 모달창 열기
  openLeaderSearchModal(): void {
    const dialogRef = this.dialog.open(LeaderSearchComponent);
    dialogRef.afterClosed().subscribe((value: any) => {
      this.leaderNoValue = value?.LeaderNo;
      this.leaderNameValue = value?.LeaderName;

      this.leaderInfoDTO.LeaderNo = this.leaderNoValue;
      this.leaderInfoDTO.LeaderName = this.leaderNameValue;
    });
  }

  // 학교명 검색 모달창 열기
  openSchoolSearchModal(): void {
    const dialogRef = this.dialog.open(SchoolSearchComponent);
    dialogRef.afterClosed().subscribe((value: any) => {
      this.schoolNameValue = value?.SchoolName;
      this.schoolNoValue = value?.SchoolNo;

      this.leaderInfoDTO.SchoolNo = this.schoolNoValue;
    });
  }
}
