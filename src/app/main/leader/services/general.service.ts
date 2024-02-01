import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Sport } from '../model/Sport.model';
import { LeaderDetailDTO } from '../model/LeaderDetail.model';
import { LeaderDTO } from '../model/Leader.model';
import { LeaderInfoDetailDTO } from '../model/LeaderInfoDetail.model';
import { LeaderInfoDTO } from '../model/LeaderInfoEdit.model';

// 서비스는 어플리케이션의 비즈니스 로직, 데이터를 처리할 때 사용함
  // 컴포넌트 간에 데이터를 공유하거나, 외부 서버와 통신할 때 사용함
  // @Injectable 데코레이터로 서비스를 정의하고, 컴포넌트에 주입해서 사용함

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  readonly ROOT_URL: string = 'https://localhost:7211';

  constructor(private http: HttpClient) { }

  // register 페이지에서 쓰일 데이터 가져오기
  getLeaderDetails(): Observable<LeaderDetailDTO> {
    return this.http.get<LeaderDetailDTO>(`${this.ROOT_URL}/Home/RegisterInfo`);
  }

  // start 페이지에서 쓰일 데이터 가져오기
  getLeaders(): Observable<LeaderDTO[]> {
    return this.http.get<LeaderDTO[]>(`${this.ROOT_URL}/Home/StartInfo`);
  }

  // removeLeaders 메서드 수정
  removeLeaders(leaderNos: string[]): Observable<any> {
    const url = `${this.ROOT_URL}/Home/Remove`;
    const options = { body: leaderNos};
    
    return this.http.delete(url, options).pipe(catchError(this.handleError));
  } 

  // detail 페이지에서 쓰일 데이터 가져오기
  getDetails(leaderNo: string): Observable<LeaderInfoDetailDTO> {
    return this.http.get<LeaderInfoDetailDTO>(`${this.ROOT_URL}/Home/DetailInfo?leaderNo=${leaderNo}`);
  }

  // edit 페이지에서 쓰일 데이터 가져오기
  getEdits(leaderNo: string): Observable<LeaderInfoDetailDTO> {
    return this.http.get<LeaderInfoDetailDTO>(`${this.ROOT_URL}/Home/EditInfo?leaderNo=${leaderNo}`);
  }

  // leader 등록하기
  postLeaders(leaderData: LeaderInfoDTO): Observable<LeaderInfoDTO> {
    console.log('전송할 데이터:', leaderData);

    return this.http.post<LeaderInfoDTO>(`${this.ROOT_URL}/Home/RegisterInfo`, leaderData);
  }

  editLeaders(leaderNo: string | undefined, leaderEditInfo: LeaderInfoDetailDTO): Observable<LeaderInfoDetailDTO> {
    console.log('전송할 데이터:', leaderEditInfo);
    const formattedLeaderNo = leaderNo!;

    return this.http.post<LeaderInfoDetailDTO>(`${this.ROOT_URL}/Home/EditInfo?leaderNo=${formattedLeaderNo}`, leaderEditInfo);
  }
  
  // 지도자 식별 코드 보내기
  private selectedLeaderNo: string | undefined;

  getSelectedLeaderNo(): string | undefined {
    return this.selectedLeaderNo;
  }

  setSelectedLeaderNo(leaderNo: string): void {
    this.selectedLeaderNo = leaderNo;
  }

  // 학교 이름 보내기
  private selectedSchoolNo: string | undefined;

  getSelectedSchoolNo(): string | undefined {
    return this.selectedSchoolNo;
  }

  setSelectedSchoolNo(schoolNo: string): void {
    this.selectedSchoolNo = schoolNo;
  }

  // 에러 핸들러 함수
  private handleError(error: HttpErrorResponse) {
    let message = '';
    if (error.error instanceof ErrorEvent) {
      console.error(`Client-side error: ${error.error.message}`);
    }
    else {
      console.error(`Server-side error: ${error.status}`);
      message = error.message;
    }

    return throwError({
      title: 'Something wrong! please try again later.',
      message
    });
  }
}
