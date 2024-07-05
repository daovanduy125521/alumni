import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item } from 'src/app/model/item';

@Component({
  selector: 'app-create-staff-dialog',
  templateUrl: './create-staff-dialog.component.html',
  styleUrls: ['./create-staff-dialog.component.css']
})
export class CreateStaffDialogComponent {
  campus : Item[] = [{id: "HN", title: "Hòa Lạc"}, {id: "DN", title: "Đà Nẵng"}]
  staffForm! : FormGroup;
  constructor(
    public dialogRef: MatDialogRef<CreateStaffDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb : FormBuilder
  ) {
    this.staffForm = fb.group({
      mainEmail : [""],
      fullName : [""],
      password : [""],
      campus : [""]
    })


  }
  ngOnInit(): void {

  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(){
    if(this.staffForm.valid){
       console.log(this.staffForm.value)
    // You can add validation logic here if needed
    this.dialogRef.close(this.staffForm.value);
    }

  }
}
