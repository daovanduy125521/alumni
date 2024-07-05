import { filter } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-approval-alumni',
  templateUrl: './approval-alumni.component.html',
  styleUrls: ['./approval-alumni.component.css']
})
export class ApprovalAlumniComponent implements OnInit{

  listUnauthorizeAlumni! : any[];
  constructor(private userService: UserServiceService){}

  ngOnInit(): void {
  this.userService.getUnauthorizeAlumni().subscribe({
    next : (data: any) => {this.listUnauthorizeAlumni = data.data.alumniList

    }
  })
  }

  rejectAlumni(userId : string) {
    this.userService.changeUserStatusById(userId, "INACTIVATED").subscribe({
      next : data => {this.listUnauthorizeAlumni = this.listUnauthorizeAlumni.filter(alnumi => alnumi.userId != userId)}
    })
  }
  approveAlumni(userId : string) {
    this.userService.changeUserStatusById(userId, "ACTIVATED").subscribe({
      next : data => {this.listUnauthorizeAlumni = this.listUnauthorizeAlumni.filter(alnumi => alnumi.userId != userId)}
    })

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
}
