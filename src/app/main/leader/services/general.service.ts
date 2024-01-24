import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sport } from '../model/Sport.model';
import { LeaderDetailDTO } from '../model/LeaderDetail.model';
import { LeaderDTO } from '../model/Leader.model';

// 서비스는 어플리케이션의 비즈니스 로직, 데이터를 처리할 때 사용함
  // 컴포넌트 간에 데이터를 공유하거나, 외부 서버와 통신할 때 사용함
  // @Injectable 데코레이터로 서비스를 정의하고, 컴포넌트에 주입해서 사용함

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  readonly ROOT_URL: string = 'https://localhost:7211';

  constructor(private http: HttpClient) { }

  getLeaderDetails(): Observable<LeaderDetailDTO> {
    return this.http.get<LeaderDetailDTO>(`${this.ROOT_URL}/Home/RegisterInfo`);
  }

  getLeaders(): Observable<LeaderDTO[]> {
    return this.http.get<LeaderDTO[]>(`${this.ROOT_URL}/Home/StartInfo`);
  }
}
