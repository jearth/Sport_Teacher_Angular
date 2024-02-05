import { Component, ViewChild } from '@angular/core';
import { AlertErrorComponent } from '../../../../utils/alert-error/alert-error.component';
import { AlertComponent } from '../../../../utils/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { LeaderDTO } from '../../model/Leader.model';
import { GeneralService } from '../../services/general.service';
import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})

export class StartComponent {
  constructor(
    private generalService: GeneralService, 
    public dialog: MatDialog,
    private http: HttpClient,
    private router: Router) { 
  }

  leaderDTO: LeaderDTO[] = [];
  tableDate: LeaderDTO[] = [];
  displayedColumns: string[] = ['position', 'leaderNo', 'leaderName', 'sportName', 'schoolName', 'detailInfo'];
  dataSource = new MatTableDataSource<LeaderDTO>(this.leaderDTO);
  itemsPerPage: number = 10; 
  currentPage: number = 1;  

  selectedRows: Set<number> = new Set<number>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedOption: string = '전체';
  OptionListOpen: boolean = false;

  ngOnInit(): void {
    this.loadData();
    this.dataSource.paginator = this.paginator;
  }

  loadData(): void {
    this.generalService.getLeaders().subscribe(
      (data: LeaderDTO[]) => {
        console.log('서버 응답:', data);
        this.leaderDTO = data;
        this.tableDate = [...this.leaderDTO];
        this.dataSource = new MatTableDataSource<LeaderDTO>(this.leaderDTO);
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('HTTP 요청 에러:', error);
      }
    );
  }

  // 옵션 열기
  toggleOptionList(): void {
    this.OptionListOpen = !this.OptionListOpen;
  }
  
  // 옵션 선택하기
  selectOption(option: string): void {
    this.selectedOption = option;
    this.OptionListOpen = true;
  }

  searchText: string = '';
  
  searchLeaders(): void {
    let filteredData: LeaderDTO[];
  
    if (this.selectedOption === '전체' && this.searchText.trim() === '') {
      // 전체를 선택하고 검색어가 없으면 모든 데이터 보여줌
      filteredData = this.leaderDTO;
    } else {
      // 검색어가 있는 경우, leaderDTO에서 필터링하여 검색 결과를 얻음
      filteredData = this.leaderDTO.filter(leader => {
        const searchCondition =
          (this.selectedOption === '이름' && leader?.leaderName?.includes(this.searchText)) ||
          (this.selectedOption === '종목' && leader?.sportName?.includes(this.searchText)) ||
          (this.selectedOption === '전체' &&
            (leader?.leaderName?.includes(this.searchText) || leader?.sportName?.includes(this.searchText)));
  
        return this.searchText.trim() !== '' && searchCondition;
      });
    }

    // 검색된 데이터를 tableDate에 할당
    this.tableDate = filteredData;

    // 검색된 데이터를 dataSource에 할당하여 테이블 갱신
    this.dataSource.data = this.tableDate; 
  }
  
  // 삭제 값 선택 에러 모달창 열기
  openStartDeleteErrorModal(): void {
    const dialogRef = this.dialog.open(AlertErrorComponent, {
      data: { title: '삭제 값 확인',
              content: '삭제 할 값이 선택되지 않았습니다.' }
    });
  }

  openStartDeleteModal(): void {
    // 유효성 검사
    let validateResult: boolean = this.selectedRows.size > 0;
    
    if (!validateResult) {
      this.openStartDeleteErrorModal();
    } else {
      const leaderNoToDelete: string[] = [];
  
      // 선택된 행들의 leaderNo를 배열에 추가하기
      this.selectedRows.forEach(index => {
        const leaderNo = this.leaderDTO[index]?.leaderNo;
        if (leaderNo) {
          leaderNoToDelete.push(leaderNo);
        }
      });
  
      const dialogRef = this.dialog.open(AlertComponent, {
        data: {
          title: '지도자 삭제',
          content: '지도자를 삭제하시겠습니까? <br>삭제된 지도자는 복구되지 않습니다.'
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteSelectedRows(leaderNoToDelete);
        }
      });
    }
  }
  
  deleteSelectedRows(leaderNo: string[]) {
    this.generalService.removeLeaders(leaderNo).subscribe({
      next: (res: any) => {
        this.leaderDTO = this.leaderDTO.filter(
          generalService => generalService.leaderNo && !leaderNo.includes(generalService.leaderNo)
        );

        this.selectedRows.clear();

        this.loadData();
      },
      error: (error: any) => console.error('[GeneralService.remove]', error)
    });
  }
  
  
  // 개별 선택 박스
  toggleCheckbox(index: number): void {
    if (this.selectedRows.has(index)) {
      this.selectedRows.delete(index);
    } else {
      this.selectedRows.add(index);
    }
  }

  // 전체 선택 박스
  toggleAll(): void {
    if (this.selectedRows.size === this.leaderDTO.length) {
      this.selectedRows.clear();
    } else {
      for (let i = 0; i < this.leaderDTO.length; i++) {
        this.selectedRows.add(i);
      }
    }
  }

  get paginationTableData(): LeaderDTO[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
  
    // 검색 결과가 있을 때만 페이지 데이터 반환
    if (this.tableDate.length > 0) {
      return this.tableDate.slice(startIndex, endIndex);
    } else {
      return [];
    }
  }
  
  // 페이지 변경 시 초기화
  onPageChange(event: any): void {
    this.currentPage = event;
  
    // 검색 결과가 없으면 페이지를 1로 초기화
    if (this.tableDate.length === 0) {
      this.currentPage = 1;
    }
  
    this.getTotalPages();
  }

  getNextPages(): number[] {
    const visiblePages: number[] = [];
  
    const totalPages = this.getTotalPages();
    const startPage = Math.max(1, this.currentPage - 2); // 시작 페이지
    const endPage = Math.min(startPage + 4, totalPages); // 종료 페이지
  
    for (let page = startPage; page <= endPage; page++) {
      visiblePages.push(page);
    }
  
    return visiblePages;
  }

  // 페이지 수 계산
  getTotalPages(): number {
    return Math.ceil(this.tableDate.length / this.itemsPerPage);
  }

}
