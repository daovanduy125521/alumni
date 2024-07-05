import { UserServiceService } from './../../services/user-service.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateStaffDialogComponent } from './create-staff-dialog/create-staff-dialog.component';
import { AccountStatus } from 'src/app/services/const/const';

@Component({
  selector: 'app-staff-management',
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.css']
})
export class StaffManagementComponent implements OnInit{
  listStaff : any[] = [];
  constructor(private dialog: MatDialog, private userService: UserServiceService){
  }
  ngOnInit(): void {
    this.userService.getAllStaff().subscribe({
      next: (data: any)=>{
        this.listStaff = data.data.staffList
      }
    })
  }
  openAddStaff(){
    const dialogRef = this.dialog.open(CreateStaffDialogComponent, {
      width: "400px"
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  convertToNormalDateFormat(dateString: string): string {
    if (!dateString || dateString === "0001-01-01T00:00:00") {
      return "Invalid Date";
    }

    const dateParts = dateString.split('T')[0].split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);

    // Format the date as mm dd yyyy
    const normalDateFormat = `${month}-${day}-${year}`;

    return normalDateFormat;
  }

  changeStatus(currentStatus : string ,email : string){
    if(confirm(`Are you sure to ${currentStatus == AccountStatus.ACTIVATED ? "Disable" : "Activate"} account: ${email}` )){

    }
  }
}
