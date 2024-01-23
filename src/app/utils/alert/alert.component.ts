import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

export interface Message {
  title: string;
  content: string;
}

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Message,
    private router: Router
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  confirmAction() {
    this.router.navigate(['/']);
    this.dialogRef.close();
  }
}
