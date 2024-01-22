import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-leader-search',
  templateUrl: './leader-search.component.html',
  styleUrl: './leader-search.component.css'
})
export class LeaderSearchComponent {
  constructor(public dialogRef: MatDialogRef<LeaderSearchComponent>) {}

  closeLeaderSearchModal(): void {
    this.dialogRef.close();
  }
}
