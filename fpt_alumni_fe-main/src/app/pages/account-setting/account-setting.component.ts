import { CommonApiService } from './../../services/common-api.service';
import { COMMA, ENTER, R } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { Item } from 'src/app/model/item';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ImageCloudService } from 'src/app/services/image-cloud.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { confirmPasswordValidator } from 'src/app/shared/validator/confirmPasswordValidator';
import { dateLessThanTodayValidator } from 'src/app/shared/validator/date.validator';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent {
  userSetting: any;
  userBasicInfoForm! : FormGroup;
  userContactInfoForm! : FormGroup;
  userWorkExperienceForm! : FormGroup;
  userWorkInfoForm! : FormGroup;
  userEducationExperienceForm! : FormGroup;
  changePasswordForm! : FormGroup;
  privacySetting : any;
  listWorkExperience : any[] = [];
  listEducationExperiences : any[] = [];
  currentYear: number = new Date().getFullYear();
  avatar : string="";
  listCountry : any[] = [];
  listState : any[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fieldCtrl = new FormControl('');
  filteredField!: Observable<string[]>;
  fields: Item[] = [];
  allFieldTittle: string[] = [];
  allField: Item[]=[];
  specializations: Item[]=[
    {title: "Khối công nghệ", id: "alumni"},
    {title: "Khối ngôn ngữ", id: "staff"},
    {title: "Khối kinh tế", id: "staff"}
  ]

  majors : Item[] = [
    {title: "Software engineer", id: "CNTT"},
    {title: "Digital marketing", id: "DM"},
    {title: "Artificial intelligence", id: "AI"}
  ]
  @ViewChild('fieldInput') fieldInput!: ElementRef<HTMLInputElement>;
  constructor(private userService : UserServiceService, private formBuilder: FormBuilder, private imageService: ImageCloudService, private commonAPI : CommonApiService
    , private authService : AuthServiceService, private localStorageSevice: LocalStorageService, private toastService : ToastServiceService, private router: Router
   ){

  }
  ngOnInit(): void {
    this.getAvatarUrl();
    this.getCountry();

    this.userBasicInfoForm = this.formBuilder.group(
      {
        id:[""],
        userId:[""],
        mainEmail  :["", [Validators.required, Validators.email]],
        // roleId :["", [Validators.required]],
        studentCode: [""],
        class : [""],
        major : [""],
        isGraduated : ["",[Validators.required]],
        campus : [""],

        fullName : ["", [Validators.required]],
        dateOfBirth : ["", [Validators.required, dateLessThanTodayValidator()]],
        graduationYear : ["", Validators.max(this.currentYear)],
        gender : ["",[Validators.required]],


      },
    );

    this.userContactInfoForm  = this.formBuilder.group(
      {
        userId:["",[Validators.required]],
        mainEmail  :["",[Validators.required]],
        phoneNumber : [""],
        linkedUrl: [""],
      }
    )

    this.userWorkInfoForm = this.formBuilder.group({
      userId:["",[Validators.required]],
      currentJob :[""],
      currentCompany:[""],
      currentJobCountry : [""],
      currentJobCity : [""],
      fieldIds: [""]
    })

    this.userWorkExperienceForm = this.formBuilder.group({
        userId:["",[Validators.required]],
        company: ["",[Validators.required]],
        position: ["",[Validators.required]],
        startDate: ["",[Validators.required]],
        endDate: ["",[Validators.required]],
        description: [""]
    }
  )
    this.userEducationExperienceForm = this.formBuilder.group({
      userId:["",[Validators.required]],
      institution: ["", [Validators.required]],
      major: ["" ,[Validators.required]],
      startDate: ["",[Validators.required]],
      endDate: ["",[Validators.required]],
      description: [""]
  }
)
    this.changePasswordForm = this.formBuilder.group({
      currentPassword:["",[Validators.required, Validators.minLength(6)]],
      password: ["",[Validators.required, Validators.minLength(6)]],
      confirmPassword: ["",[Validators.required, Validators.minLength(6)]],
    },{ validators: confirmPasswordValidator })
    this.initialUserInfo();
    this.getAllField();

  }
  get id() { return this.userBasicInfoForm.get('id'); }
  get userId() { return this.userBasicInfoForm.get('userId'); }
  get mainEmail() { return this.userBasicInfoForm.get('mainEmail'); }
  get studentCode() { return this.userBasicInfoForm.get('studentCode'); }
  get classControl() { return this.userBasicInfoForm.get('class'); } // renamed to avoid conflict with reserved word
  get major() { return this.userBasicInfoForm.get('major'); }
  get isGraduated() { return this.userBasicInfoForm.get('isGraduated'); }
  get job() { return this.userBasicInfoForm.get('job'); }
  get company() { return this.userBasicInfoForm.get('company'); }
  get fullName() { return this.userBasicInfoForm.get('fullName'); }
  get dateOfBirth() { return this.userBasicInfoForm.get('dateOfBirth'); }
  get graduationYear() { return this.userBasicInfoForm.get('graduationYear'); }
  get gender() { return this.userBasicInfoForm.get('gender'); }
  get country() { return this.userBasicInfoForm.get('country'); }
  get city() { return this.userBasicInfoForm.get('city'); }
  get fieldIds() { return this.userBasicInfoForm.get('fieldIds'); }

//user work info form
  get currentJob(){return this.userWorkInfoForm.get('currentJob')}
  get currentCompany(){return this.userWorkInfoForm.get('currentCompany')}
  get currentJobCountry(){return this.userWorkInfoForm.get('currentJobCountry')}
  get currentJobCity(){return this.userWorkInfoForm.get('currentJobCity')}
  get currentFieldIds(){return this.userWorkInfoForm.get('fieldIds')}

// work experience form
  get workCompany(){ return this.userWorkExperienceForm.get('company');}
  get workPosition(){ return this.userWorkExperienceForm.get('position');}
  get workStartDate(){ return this.userWorkExperienceForm.get('startDate');}
  get workEndDate(){ return this.userWorkExperienceForm.get('endDate');}

// edu exprience form
  get eduInstitution(){ return this.userEducationExperienceForm.get("institution")}
  get eduMajor(){ return this.userEducationExperienceForm.get("major")}
  get eduStartDate(){ return this.userEducationExperienceForm.get("startDate")}
  get eduEndDate(){ return this.userEducationExperienceForm.get("endDate")}

// reset password form
  get currentPassword(){return this.changePasswordForm.get("currentPassword")}
  get password(){return this.changePasswordForm.get("password")}
  get confirmPassword(){return this.changePasswordForm.get("confirmPassword")}

  getAvatarUrl():void{
    let userId = this.localStorageSevice.getItem("userId")
    this.imageService.getImageUrl("images/avatar/"+ userId).subscribe({
      next: data => {
        if(data){
          this.avatar = data;
          console.log(data)
        }
      },
      error: err =>{
        console.log(err)
        this.avatar = "";
      }
    })

  }

  getAllField(){
    this.commonAPI.getAllFields().subscribe({
      next : (data : any) =>{
        this.allField = data.data.map((field :any) => ({
          title : field.fieldName,
          id : field.id
        }))
        if(this.allField.length>0){
          this.allFieldTittle = this.allField.map(item => item.title);
          this.filteredField = this.fieldCtrl.valueChanges.pipe(
            startWith(null),
            // map((field: string | null) => (field ? this._filter(field) : this.allFieldTittle.slice())),
            map((field: string | null) =>  this._filter()),
          );

        }

      },
      error: err =>{console.log("error when try get data from server")}
    })
  }

  getCountry(){
    this.userService.getProvince().subscribe({
      next: countriesData =>{this.listCountry = countriesData},
      error: err => console.error('Observable emitted an error: ' + err),
      complete: () => console.log('Observable emitted the complete notification')
    })
  }


  findAllStateByCountry(selectedCountry : any){
    if(selectedCountry.states){
      this.listState = selectedCountry.states;
    }
  }

  remove(fieldIdToDelete: string): void {
    let index = this.findIndexItemInArray(this.fields ,fieldIdToDelete);
    if(index != -1){
      this.fields.splice(index, 1);
      this.setFieldIds(this.fields.map(field => field.id))
    }
    this.fieldCtrl.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let field = this.getFieldByTitle(event.option.viewValue)
    if(field){
      this.fields.push(field);
      this.setFieldIds(this.fields.map(field => field.id))
    }
    this.fieldInput.nativeElement.value = '';
    this.fieldCtrl.setValue(null);
  }

  private _filter(): string[] {
    const setField = new Set(this.fields.map(item => item.id));
    return this.allField.filter(field => !setField.has(field.id)).map(field => field.title);
  }

  getFieldByTitle(title: string): Item | null {
    let field = this.allField.find(field => field.title === title);
    if (field) {
      return field;
    } else {
      return null; // Explicitly return null if field is not found
    }
  }

  findIndexItemInArray(array : Item[], id: string): number{
    if(id){
      const index = array.findIndex(item => item.id == id);
    return index;
    }
    return -1;

  }

  setFieldIds(listField : string[]){
    this.userWorkInfoForm.controls['fieldIds'].setValue(listField);
  }

  add(event: MatChipInputEvent): void {
    // const value = (event.value || '').trim();
    // // Add our field
    // if (value ) {
    //   this.fields.push(value);
    // }
    // // Clear the input value
    // event.chipInput!.clear();
    // this.fieldCtrl.setValue(null);
  }

  saveInfo(){
    console.log(this.userBasicInfoForm.value)
    if(this.userBasicInfoForm.valid){
 this.userService.updateUserSetting(this.userBasicInfoForm.value).subscribe({
      next: data => {console.log(data)}
    })
    }
    else{
      this.toastService.showToast({
        title: 'Invalid input',
        message: 'Please fill out all required fields',
        type: 'warning',
        duration: 5000,
      });
    }
  }

  initialUserInfo(){
    this.userService.getUserSetting().subscribe({
      next: (data : any) => {this.userSetting = data.data.alumni;
        console.log(this.userSetting)
        this.userBasicInfoForm.patchValue({
          userId: this.userSetting.userId,
          mainEmail  :this.userSetting.mainEmail,
          // roleId :["", [Validators.required]],
          studentCode: this.userSetting.studentCode,
          class : this.userSetting.class,
          major : this.userSetting.major,
          isGraduated : this.userSetting.isGraduated,

          fullName : this.userSetting.fullName,
          dateOfBirth : this.userSetting.dateOfBirth,
          graduationYear : this.userSetting.graduationYear,
          gender : this.userSetting.gender,
        })

        this.userContactInfoForm.setValue({
          userId: this.userSetting.userId,
          mainEmail  :this.userSetting.mainEmail,
          phoneNumber : this.userSetting.phoneNumber,
          linkedUrl: this.userSetting.linkedUrl,
        })

        this.userWorkInfoForm.patchValue({
          userId: this.userSetting.userId,
          currentJob : this.userSetting.job,
          currentCompany: this.userSetting.company,
          currentJobCountry : this.userSetting.country,
          currentJobCity : this.userSetting.city,

        })

        this.userWorkExperienceForm.patchValue({
          userId: this.userSetting.userId,
        })

        this.userEducationExperienceForm.patchValue({
          userId: this.userSetting.userId,
        })

        this.listWorkExperience = this.userSetting.workExperiences != null ? this.userSetting.workExperiences : [];
        this.listEducationExperiences = this.userSetting.educationExperiences  != null ? this.userSetting.educationExperiences : [];
        this.privacySetting = this.userSetting.privacySetting;
        if(this.userSetting.fields){
          this.fields = this.userSetting.fields.map((item: any) =>{
            return {
              title: item.fieldName,
              id: item.id
            }
          })
          if(this.fields){
            this.setFieldIds(this.fields.map(field => field.id))
          }
        }
      }
    })
  }

  saveContactInfo(){
    console.log(this.userContactInfoForm.value)
    // this.userService.updateUserSetting(this.userContactInfoForm.value).subscribe({
    //   next: data => {console.log(data)}
    // })
  }

  saveUserWorkInfo(){
    console.log(this.userWorkInfoForm.value)
  }

  addWorkExperience(){
    console.log(this.listWorkExperience)
    if(this.userWorkExperienceForm.valid){
      this.userService.addWorkExperience(this.userWorkExperienceForm.value).subscribe({
      next: data => {
        this.toastService.showToast({
          title: 'Add Success',
          message: 'Add Work Experience Success',
          type: 'success',
          duration: 5000,
        });
        console.log(data);
        this.listWorkExperience.push(this.userWorkExperienceForm.value)
        this.resetWorkForm();
      }
    })
    }else{
      this.userWorkExperienceForm.markAllAsTouched();
      this.toastService.showToast({
        title: 'Invalid input',
        message: 'Please fill out all required fields',
        type: 'warning',
        duration: 5000,
      });
    }

  }

  addEducationExpriene(){
    if(this.userEducationExperienceForm.valid){
      this.userService.addEducationExperience(this.userEducationExperienceForm.value).subscribe({
      next: data => {{
        this.toastService.showToast({
          title: 'Add Success',
          message: 'Add Education Experience Success',
          type: 'success',
          duration: 5000,
        });
        this.listEducationExperiences.push(this.userEducationExperienceForm.value)
        this.resetEducationForm();
        }}
    })
    }else{
      this.userEducationExperienceForm.markAllAsTouched();
      this.toastService.showToast({
        title: 'Invalid input',
        message: 'Please fill out all required fields',
        type: 'warning',
        duration: 5000,
      });
    }

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

  changePassord(){
    if(this.changePasswordForm.valid){
      this.authService.changePassword(this.userId?.value, this.currentPassword?.value, this.confirmPassword?.value).subscribe({
      next: data => {
        this.toastService.showToast({
          title: 'Change password',
          message: 'Change password Success',
          type: 'success',
          duration: 5000,
        });
      }
    })
    }else{
      this.changePasswordForm.markAllAsTouched();
      this.toastService.showToast({
        title: 'Invalid input',
        message: 'Please check your password again',
        type: 'warning',
        duration: 5000,
      });
    }


  }

  resetWorkForm(){
    let userIdBackup = this.userWorkExperienceForm.get('userId')?.value;
    this.userWorkExperienceForm.reset();
    this,this.userWorkExperienceForm.patchValue({
      userId: userIdBackup
    })
  }

  resetEducationForm(){
    let userIdBackup = this.userEducationExperienceForm.get('userId')?.value;
    this.userEducationExperienceForm.reset();
    this,this.userEducationExperienceForm.patchValue({
      userId: userIdBackup
    })
  }

  navigateForgotPassword(){
    this.router.navigate(["forgot"])
  }
}
