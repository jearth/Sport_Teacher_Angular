import { Component } from '@angular/core';
import { AlertErrorComponent } from '../../utils/alert-error/alert-error.component';
import { AlertComponent } from '../../utils/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent {
  constructor(public dialog: MatDialog) {}

  selectedOption: string = '전체';
  searchQuery: string = '';
  showOptions: boolean = false;

  options: string[] = ['전체', '이름', '종목'];

  toggleOptions(): void {
    console.log('aaaa');
    this.showOptions = !this.showOptions;
  }

  selectOption(option: string): void {
    console.log('bbbb');
    this.selectedOption = option;
    this.showOptions = false;
  }

  // 삭제 값 선택 에러 모달창 열기
  openStartDeleteErrorModal(): void {
    const dialogRef = this.dialog.open(AlertErrorComponent, {
      data: { title: '삭제 값 확인',
              content: '삭제 할 값이 선택되지 않았습니다.' }
    });
  }

  // 삭제 모달창 열기
  openStartDeleteModal(): void {
    // 유효성 검사
    let validateResult: boolean = false;
    
    if (!validateResult) {
      this.openStartDeleteErrorModal();
    } else {
      const dialogRef = this.dialog.open(AlertComponent, {
        data: {
          title: '지도자 삭제',
          content: '지도자를 삭제하시겠습니까? <br>삭제된 지도자는 복구되지 않습니다.'
        }
      });
    }
  }
}
