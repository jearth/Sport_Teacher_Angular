import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-school-search',
  templateUrl: './school-search.component.html',
  styleUrl: './school-search.component.css'
})
export class SchoolSearchComponent {
  constructor(public dialogRef: MatDialogRef<SchoolSearchComponent>) {}

  closeSchoolSearchModal(): void {
    this.dialogRef.close();
  }
}
