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

  tel1: string = '';
  tel2: string = '';
  tel3: string = '';

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
        },
        (error) => {
          console.error('리더 정보를 가져오는 동안 오류가 발생했습니다.', error);
        }
      );
    });
  }
  
  openEditSuccessModal(): void {
    // 유효성 검사
    let validateResult: boolean = this.allvalidation(0);

    
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

  schoolNameValue: string | undefined;
  schoolNoValue: string | undefined;
  
  // 학교명 검색 모달창 열기
  openSchoolSearchModal(): void {
    const dialogRef = this.dialog.open(SchoolSearchComponent);
    dialogRef.afterClosed().subscribe((value: any) => {

      this.schoolNameValue = value?.SchoolName;
      this.schoolNoValue = value?.SchoolNo;

      this.leaderInfo.schoolNo = this.schoolNoValue;
      this.leaderInfo.schoolName = this.schoolNameValue
    });
  }

  // 근무 이력 테이블 추가
  addHistoryRow() {
    const newWorkRow = {
      workPlace: '',
      startDT: new Date(),
      endDT: new Date(),
      sportNo: '',
    };
  
    for (const work of this.leaderInfo.work!) {
      if (!work.workPlace) {
        alert("근무기관을 입력해주세요.");
        return;
      }

      if (!work.startDT) {
        alert("근무시작일을 입력해주세요.");
        return;
      }

      if (!work.sportNo) {
        alert("종목을 입력해주세요.");
        return;
      }
    }

    this.leaderInfo.work!.push(newWorkRow);
  }
  
  // 근무 이력 테이블 삭제
  deleteHistoryRow(index: number) {
    this.leaderInfo.work!.splice(index, 1);
  }

  // 자격사항 테이블 추가
  addCertificateRow() {
    const newCertificateRow = {
      certificateName: '',
      certificateNumber: '',
      certificateDT: new Date(),
      origanization: '',
    };

    for (const certificate of this.leaderInfo.certificate!) {
      if (!certificate.certificateName) {
        alert("자격/면허를 입력해주세요.");
        return;
      }
  
      if (!certificate.certificateNumber) {
        alert("자격번호를 입력해주세요.");
        return;
      }

      if (!certificate.certificateDT) {
        alert("취득일자를 입력해주세요.");
        return;
      }
  
      if (!certificate.origanization) {
        alert("발급기관을 입력해주세요.");
        return;
      }
    }
  
      this.leaderInfo.certificate!.push(newCertificateRow);
  }

  // 자격사항 테이블 삭제
  deleteCertificateRow(index: number) {
    this.leaderInfo.certificate!.splice(index, 1);
  }


  // 지도자 등록 취소 모달창 열기
  openEditCancelModal(): void {
    const dialogRef = this.dialog.open(AlertComponent, {
      data: { title: '지도자 수정 취소',
              content: '지도자 수정을 취소하시겠습니까? <br> 작성한 내용은 모두 삭제됩니다.' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/']);
      }
    });
  }

  // 필수입력값 에러 모달창 열기
  openEditErrorModal(): void {
    const dialogRef = this.dialog.open(AlertErrorComponent, {
      data: { title: '필수입력값 확인',
              content: '필수입력값이 채워지지 않았습니다. <br> 확인후 채워주시기 바랍니다.' }
    });
  }

  // 생년월일 유효성 검사 함수
  validateBirthday(): boolean {
    if (!this.leaderInfo.birthday) {
        return false;  // 값이 없으면 false 반환
    }

    const enteredDate = new Date(this.leaderInfo.birthday);
    return enteredDate > new Date();
  }

  isTelNumberValid: boolean = true;

  trimAndValidate(value: string): string {
    const trimmedValue = value.trim();

    if (/^\d+$/.test(trimmedValue)) {
      return trimmedValue;
    } else {
      // 숫자가 아닌 경우 빈 문자열 반환
      return '';
    }
  }

  // 근무지 전화번호 유효성 검사 함수
  calculateTelNo(): boolean {
    const tel1 = this.trimAndValidate(this.tel1);
    const tel2 = this.trimAndValidate(this.tel2);
    const tel3 = this.trimAndValidate(this.tel3);
  
    if (tel1 && tel2 && tel3) {
      this.leaderInfo.telNo = `${tel1}-${tel2}-${tel3}`;
      this.isTelNumberValid = true;
      return true;
    } else {
      this.isTelNumberValid = false;
      return false;
    }
  }

  // 근무 시작일 유효성 검사 함수
  checkStartDate(index: number): boolean {
    const work = this.leaderInfo.work && this.leaderInfo.work[index];
    const startDate = work && work.startDT;
    const today = new Date();
  
    return !!startDate && new Date(startDate) < today;
  }
  
  // 근무 종료일 유효성 검사 함수 
  checkEndDate(index: number): boolean {
    const work = this.leaderInfo.work && this.leaderInfo.work[index];
    const startDate = work && work.startDT;
    const endDate = work && work.endDT;
  
    return !!startDate && !!endDate && new Date(startDate) > new Date(endDate);
  }

  // 자격번호 유효성 검사
  checkCertificateNumberDate(index: number): boolean {
    const certificate = this.leaderInfo.certificate && this.leaderInfo.certificate[index];
    const certificateNumber = certificate && certificate.certificateNumber;
    const regex = /^[ㄱ-힣]+$/;

    return !!certificateNumber && regex.test(certificateNumber);
  }

  // 취득일자 유효성 검사 함수
  checkCertificateDTDate(index: number): boolean {
    const certificate = this.leaderInfo.certificate && this.leaderInfo.certificate[index];
    const certificateDate = certificate && certificate.certificateDT;
    const today = new Date();
  
    return !!certificateDate && new Date(certificateDate) > today;
  }

   // 전체 유효성 검사 true, false
   allvalidation(index: number): boolean {
    let isBirthdayValid: boolean = this.validateBirthday();
    let iscalculateTelNo: boolean = this.calculateTelNo();
    let ischeckStartDate: boolean = this.checkStartDate(index);
    let ischeckEndDate: boolean = this.checkEndDate(index);
    let ischeckGetDate: boolean = this.checkCertificateDTDate(index);
    let ischeckNumberDate: boolean = this.checkCertificateNumberDate(index);

    let isImagebaseValid: boolean = this.leaderInfo?.imageBase?.trim() !== '';
    let isSportNoValid: boolean = this.leaderInfo?.sportNo?.trim() !== '';
    let isEmpDTValid: boolean = this.leaderInfo?.empDT?.toString().trim() !== '';
    let isBirthdayinfoValid: boolean = this.leaderInfo?.birthday?.toString().trim() !== '';
    let isWorkValid: boolean = true;

    for (let workIndex = 0; this.leaderInfo?.work && workIndex < this.leaderInfo.work.length; workIndex++) {
      let isWorkPlaceValid: boolean = this.leaderInfo.work?.[workIndex]?.workPlace?.trim() !== '';
      let isStartDTValid: boolean = this.leaderInfo.work?.[workIndex]?.startDT?.toString().trim() !== '';
      let isWorkSportNoValid: boolean = this.leaderInfo.work?.[workIndex]?.sportNo?.trim() !== '';

      isWorkValid = isWorkPlaceValid && isStartDTValid && isWorkSportNoValid;
    }
    let isCertificateValid: boolean = true;

    for (let certificateIndex = 0; this.leaderInfo?.certificate && certificateIndex < this.leaderInfo.certificate.length; certificateIndex++) {
      let isCertificateNameValid: boolean = this.leaderInfo.certificate?.[certificateIndex]?.certificateName?.trim() !== '';
      let isCertificateNumberValid: boolean = this.leaderInfo.certificate?.[certificateIndex]?.certificateNumber?.trim() !== '';
      let isCertificateDTValid: boolean = this.leaderInfo.certificate?.[certificateIndex]?.certificateDT?.toString().trim() !== '';
      let isOriganizationValid: boolean = this.leaderInfo.certificate?.[certificateIndex]?.origanization?.trim() !== '';

      isCertificateValid = isCertificateNameValid && isCertificateNumberValid && isCertificateDTValid && isOriganizationValid;
    }
    
    return !isBirthdayValid && iscalculateTelNo && ischeckStartDate &&
            !ischeckEndDate && !ischeckGetDate && !ischeckNumberDate &&
            isImagebaseValid && isSportNoValid && isEmpDTValid &&
            isBirthdayinfoValid && isWorkValid && isCertificateValid;
  }
}