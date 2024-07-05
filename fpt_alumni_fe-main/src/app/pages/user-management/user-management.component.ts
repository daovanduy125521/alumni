import { AuthServiceService } from './../../services/auth-service.service';
import { Alumni, EducationExperience, WorkExperience } from '../../model/alumni';
import { UserServiceService } from './../../services/user-service.service';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { Item } from 'src/app/model/item';
import { of, switchMap } from 'rxjs';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import {Router } from '@angular/router';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit{
  alumniList! : Alumni[];
  roles! : Item[];
  totalAlumni : number= 0;
   constructor(private dialog: MatDialog, private userService: UserServiceService, private cdr: ChangeDetectorRef, private authService: AuthServiceService,
    private router: Router
   ){

  }
// readonly columns = Object.keys(this.userList[0]);


    ngOnInit(): void {
      this.getAllAlumni();
      this.getAllRoles();
      console.log(this.authService.getRefreshToken())

    }
    addUserDialog(){
      const dialogRef = this.dialog.open(AddUserDialogComponent, {
        width: '800px',
        data: { // Default data for new user
          listRole: this.roles
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) { // Check if user data was received from dialog
          this.userService.createNewUser(result).pipe(
            switchMap(result => {
              console.log(result)
              return this.userService.getAllUser()
            })
          ).subscribe({
            next : data =>{
              this.alumniList = data.data.map((user :any) => ({
                id: user.id,
                email: user.email,
                role: user.roleId,
                status: user.status
              }))
              console.log(this.alumniList)
            },
            error: err =>{console.log("error when try get data from server")}

          });
        }
      });
    }

    searchUser(){
      let searchAlumni = this.createEmptyUser();
      this.alumniList.push(searchAlumni)
      this.cdr.detectChanges();
      console.log(this.alumniList)
    }

    getRoleTilteById(id : string) : string{
    if(this.roles){
      let role = this.roles.find(role=> role.id == id);
      if(role){
        return role.title;
      }
    }
      return "Unknow"
    }

    getAllAlumni(){
      this.userService.getActivatedAlumni().subscribe({
        next : (data : any) =>{
          this.alumniList = data.data.alumniList.map((alumniItem: any)=> this.mapAlumniData(alumniItem));
          this.totalAlumni = this.alumniList.length;
        },
        error: err =>{console.log("error when try get data from server")}

      })
    }

    getAllRoles(){
      this.userService.getAllRole().subscribe({
        next : (data: any)  =>{
          this.roles = data.data.map((role :any) => ({
            title : role.roleName,
            id : role.id
          }))
        },
        error: err =>{console.log("error when try get data from server")}
      })
    }

    navigateImportAlumni(){
      this.router.navigate(["admin/user_management/import"])
    }

    navigateApprovalUser(){
      this.router.navigate(["admin/user_management/approval"])
    }

    openEditUserDialog(userId : string){
      let user = this.userService.getUserById(userId);
      if(user){
        const dialogRef = this.dialog.open(EditUserDialogComponent, {
          width: '800px',
          data: { // Default data for new user
            listRole: this.roles
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) { // Check if user data was received from dialog
            this.userService.createNewUser(result).pipe(
              switchMap(result => {
                console.log(result)
                return this.userService.getAllUser()
              })
            ).subscribe({
              next : data =>{
                this.alumniList = data.data.map((user :any) => ({
                  id: user.id,
                  email: user.email,
                  role: user.roleId,
                  status: user.status
                }))
                console.log(this.alumniList)
              },
              error: err =>{console.log("error when try get data from server")}

            });
          }
        });
      }
    }

    private mapAlumniData(data: any): Alumni {
      return {
        id: data.id,
        mainEmail: data.mainEmail,
        password: data.password,
        roleId: data.roleId,
        roleName: data.roleName,
        avartar: data.avartar,
        studentCode: data.studentCode,
        phoneNumber: data.phoneNumber,
        class: data.class,
        major: data.major,
        isGraduated: data.isGraduated,
        job: data.job,
        company: data.company,
        linkedUrl: data.linkedUrl,
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        graduationYear: data.graduationYear,
        gender: data.gender,
        country: data.country,
        city: data.city,
        userId: data.userId,
        workExperiences: this.mapWorkExperiences(data.workExperiences),
        educationExperiences: this.mapEducationExperiences(data.educationExperiences),
        privacySetting: {
          emailPublic: data.privacySetting ? data.privacySetting.emailPublic : false,
          phonePublic: data.privacySetting ? data.privacySetting.phonePublic : false
        },
        status: data.status,
        fields: data.fields
      };
    }

    private mapWorkExperiences(workExperiences: any[]): WorkExperience[] {
      if (!workExperiences) {
        return [];
      }
      return workExperiences.map((exp: any) => ({
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate,
        endDate: exp.endDate
      }));
    }

    private mapEducationExperiences(educationExperiences: any[]): EducationExperience[] {
      if (!educationExperiences) {
        return [];
      }
      return educationExperiences.map((exp: any) => ({
        institution: exp.institution,
        major: exp.major,
        startDate: exp.startDate,
        endDate: exp.endDate
      }));
    }


    createEmptyUser(): Alumni {
      return {
        id: '',
        mainEmail: '',
        password: '',
        roleId: '',
        roleName: '',
        avartar: '',
        studentCode: '',
        phoneNumber: '',
        class: '',
        major: '',
        isGraduated: false,
        job: '',
        company: '',
        linkedUrl: '',
        fullName: '',
        dateOfBirth: '',
        graduationYear: '',
        gender: 0, // Assuming 0 is for undefined gender
        country: '',
        city: '',
        userId: '',
        workExperiences: [],
        educationExperiences: [],
        privacySetting: {
          emailPublic: false,
          phonePublic: false
        },
        status: '',
        fields: null // You can specify the type for 'fields' if needed
      };
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

    getGenderString(gender: number) : string{
      switch(gender){
        case 0:
          return "FEMALE"
        case 1:
          return "MALE"
        case 2:
          return "OTHER"
        default:
          return "";
      }
    }

}
