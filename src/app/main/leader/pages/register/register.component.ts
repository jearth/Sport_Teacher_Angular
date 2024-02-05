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
    let validateResult: boolean = this.allvalidation(0);

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
        if (result) this.register();
      });
    }
  }

  // 지도자 등록
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
    const newWorkRow = {
      WorkPlace: '',
      StartDT: new Date(),
      EndDT: new Date(),
      SportNo: '',
    };
  
    for (const work of this.leaderInfoDTO.Work!) {
      if (!work.WorkPlace) {
        alert("근무기관을 입력해주세요.");
        return;
      }

      if (!work.StartDT) {
        alert("근무시작일을 입력해주세요.");
        return;
      }

      if (!work.SportNo) {
        alert("종목을 입력해주세요.");
        return;
      }
    }

    this.leaderInfoDTO.Work!.push(newWorkRow);
  }

  // 근무 이력 테이블 삭제
  deleteHistoryRow(index: number) {
    this.leaderInfoDTO.Work!.splice(index, 1);
  }
  
  // 자격사항 테이블 추가
  addCertificateRow() {
    const newCertificateRow = {
      CertificateName: '',
      CertificateNumber: '',
      CertificateDT: new Date(),
      Origanization: '',
    };

    for (const certificate of this.leaderInfoDTO.Certificate!) {
      if (!certificate.CertificateName) {
        alert("자격/면허를 입력해주세요.");
        return;
      }
  
      if (!certificate.CertificateNumber) {
        alert("자격번호를 입력해주세요.");
        return;
      }

      if (!certificate.CertificateDT) {
        alert("취득일자를 입력해주세요.");
        return;
      }
  
      if (!certificate.Origanization) {
        alert("발급기관을 입력해주세요.");
        return;
      }
    }
  
      this.leaderInfoDTO.Certificate!.push(newCertificateRow);
  }

  // 자격사항 테이블 삭제
  deleteCertificateRow(index: number) {
    this.leaderInfoDTO.Certificate!.splice(index, 1);
  }

  // 지도자 등록 취소 모달창 열기
  openRegisterCancelModal(): void {
    const dialogRef = this.dialog.open(AlertComponent, {
      data: { title: '지도자 등록 취소',
              content: '지도자 등록을 취소하시겠습니까? <br> 작성한 내용은 모두 삭제됩니다.' }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/']);
      }
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

  // 생년월일 유효성 검사 함수
  validateBirthday(): boolean {
    if (!this.leaderInfoDTO.Birthday) {
        return false;  // 값이 없으면 false 반환
    }

    const enteredDate = new Date(this.leaderInfoDTO.Birthday);
    return enteredDate > new Date();
}

  isTelNumberValid: boolean = true;

  // 근무지 전화번호 유효성 검사 함수
  calculateTelNo(): boolean {
    const tel1 = this.trimAndValidate(this.tel1);
    const tel2 = this.trimAndValidate(this.tel2);
    const tel3 = this.trimAndValidate(this.tel3);
  
    if (tel1 && tel2 && tel3) {
      this.leaderInfoDTO.TelNo = `${tel1}-${tel2}-${tel3}`;
      this.isTelNumberValid = true;
      return true;
    } else {
      this.isTelNumberValid = false;
      return false;
    }
  }

  // 근무 시작일 유효성 검사 함수
  checkStartDate(index: number): boolean {
    const work = this.leaderInfoDTO.Work && this.leaderInfoDTO.Work[index];
    const startDate = work && work.StartDT;
    const today = new Date();
  
    return !!startDate && new Date(startDate) < today;
  }
  
  
  // 근무 종료일 유효성 검사 함수 
  checkEndDate(index: number): boolean {
    const work = this.leaderInfoDTO.Work && this.leaderInfoDTO.Work[index];
    const startDate = work && work.StartDT;
    const endDate = work && work.EndDT;
  
    return !!startDate && !!endDate && new Date(startDate) > new Date(endDate);
  }

  // 자격번호 유효성 검사
  checkCertificateNumberDate(index: number): boolean {
    const certificate = this.leaderInfoDTO.Certificate && this.leaderInfoDTO.Certificate[index];
    const certificateNumber = certificate && certificate.CertificateNumber;
    const regex = /^[ㄱ-힣]+$/;

    return !!certificateNumber && regex.test(certificateNumber);
  }

  // 취득일자 유효성 검사 함수
  checkCertificateDTDate(index: number): boolean {
    const certificate = this.leaderInfoDTO.Certificate && this.leaderInfoDTO.Certificate[index];
    const certificateDate = certificate && certificate.CertificateDT;
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

    let isImagebaseValid: boolean = this.leaderInfoDTO?.ImageBase?.trim() !== '';
    let isSportNoValid: boolean = this.leaderInfoDTO?.SportNo?.trim() !== '';
    let isEmpDTValid: boolean = this.leaderInfoDTO?.EmpDT?.toString().trim() !== '';
    let isBirthdayinfoValid: boolean = this.leaderInfoDTO?.Birthday?.toString().trim() !== '';
    let isWorkValid: boolean = true;

    for (let workIndex = 0; this.leaderInfoDTO?.Work && workIndex < this.leaderInfoDTO.Work.length; workIndex++) {
      let isWorkPlaceValid: boolean = this.leaderInfoDTO.Work?.[workIndex]?.WorkPlace?.trim() !== '';
      let isStartDTValid: boolean = this.leaderInfoDTO.Work?.[workIndex]?.StartDT?.toString().trim() !== '';
      let isWorkSportNoValid: boolean = this.leaderInfoDTO.Work?.[workIndex]?.SportNo?.trim() !== '';

      isWorkValid = isWorkPlaceValid && isStartDTValid && isWorkSportNoValid;
    }
    let isCertificateValid: boolean = true;

    for (let certificateIndex = 0; this.leaderInfoDTO?.Certificate && certificateIndex < this.leaderInfoDTO.Certificate.length; certificateIndex++) {
      let isCertificateNameValid: boolean = this.leaderInfoDTO.Certificate?.[certificateIndex]?.CertificateName?.trim() !== '';
      let isCertificateNumberValid: boolean = this.leaderInfoDTO.Certificate?.[certificateIndex]?.CertificateNumber?.trim() !== '';
      let isCertificateDTValid: boolean = this.leaderInfoDTO.Certificate?.[certificateIndex]?.CertificateDT?.toString().trim() !== '';
      let isOriganizationValid: boolean = this.leaderInfoDTO.Certificate?.[certificateIndex]?.Origanization?.trim() !== '';

      isCertificateValid = isCertificateNameValid && isCertificateNumberValid && isCertificateDTValid && isOriganizationValid;
    }
    
    return !isBirthdayValid && iscalculateTelNo && ischeckStartDate &&
            !ischeckEndDate && !ischeckGetDate && !ischeckNumberDate &&
            isImagebaseValid && isSportNoValid && isEmpDTValid &&
            isBirthdayinfoValid && isWorkValid && isCertificateValid;
  }
}
