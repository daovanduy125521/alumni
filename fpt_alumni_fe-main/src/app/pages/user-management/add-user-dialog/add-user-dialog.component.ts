import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item } from 'src/app/model/item';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class AddUserDialogComponent implements OnInit{


  roles : Item[];
  userForm! : FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb : FormBuilder
  ) {
    this.userForm = fb.group({
      email : [""],
      roleId : [""]
    })

    this.roles = data.listRole;
    this.roles[0].title
    console.log(this.roles[0].title);
  }
  ngOnInit(): void {

    this.roles[0].title
    console.log(this.roles[0].title);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(){
    if(this.userForm.valid){
       console.log(this.userForm.value)
    // You can add validation logic here if needed
    this.dialogRef.close(this.userForm.value);
    }

  }



}
