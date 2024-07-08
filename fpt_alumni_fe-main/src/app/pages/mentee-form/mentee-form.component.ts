import { G } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-mentee-form',
  templateUrl: './mentee-form.component.html',
  styleUrls: ['./mentee-form.component.css'],
})
export class MenteeFormComponent {
  menteeForm: FormGroup;
  selectedFiles: File[] = [];
  arrayIdConnect: any[] | undefined;
  languageList: any[] = [
    {
        id: "e19e1d4e-1b21-4a8a-a447-2b8b09364e1b",
        name: "Vietnameses"
    },
    {
        id: "8d77b2eb-0b74-4ec9-b23e-4cf7e2f013d7",
        name: "Korean"
    },
    {
        id: "7e973b1b-05c7-4e35-9434-5e6e2d3db3e9",
        "name": "Chinese"
    },
    {
        id: "f6045a6f-2c1d-45b0-9758-6a4c6d2a7e84",
        "name": "Japanese"
    },
    {
        id: "2f47a66c-65df-4e8b-87ad-8e9b8d46b4d2",
        "name": "English"
    }
  ]

  fieldList: any[] = [
    {
      fieldName: "IT",
      id: "6f1cfe98-87b2-49b0-a8b1-6b0e0db2d2b9"
    },
    {
      fieldName: "Business",
      id: "1bb27ad7-5d67-43c8-9ba5-f39463f15e64"
    }
  
  ]

  workingConnectionFilters: any[] = [
    {
        id: "bb7e8a1e-8f0b-4687-bd56-0a1e2c7b8d6e",
        typeName: "Offline Mentoring",
        checked: false
    },
    {
        id: "1d8d8a7b-d5c3-40b7-953e-1aebcce2a6d3",
        typeName: "1:1 (One-to-One)",
        checked: false
    },
    {
        id: "56a4d729-7c4b-42a8-9a5f-3d5a7b6e4e3f",
        typeName: "1:n (Group)",
        checked: false
    },
    {
        id: "0c5f3b4b-9f5a-40d5-85a2-6b3d7c8a4b9d",
        typeName: "Online Mentoring",
        checked: false
    }
  ]
  idLanguage: any;
  idField: any;

  constructor(private fb: FormBuilder, private postService: PostService, private toastSerice : ToastServiceService, private router: Router) {
    this.menteeForm = this.fb.group({
      menteeFullName: ['', Validators.required],
      menteeEmail: ['', [Validators.required, Validators.email]],
      menteePhone: ['', [Validators.required, Validators.pattern('[0]{1}[0-9]{9}')]],
      menteeGender: ['', Validators.required],
      menteeStudentCode: [''],
      menteeCurrentCountry: ['', Validators.required],
      menteeCurrentCity: ['', Validators.required],
      menteeLanguage: [''],
      menteeField: [''],
      menteeLinkedIn: ['', [Validators.required]],
      menteeCV: [''],
      workExperiences: this.fb.array([]),
      menteeReason: ['']
    });
  }

  get f() { return this.menteeForm.controls; }

  get workExperiences() {
    return this.menteeForm.controls['workExperiences'] as FormArray;
  }

  addWorkExperience() {
    this.workExperiences.push(this.fb.group({
      companyName: [''],
      workPosition: [''],
      startMonth: [''],
      endMonth: [''],
      stillWorking: [false],
      jobDescription: ['']
    }));
  }

  removeWorkExperience(index: number) {
    this.workExperiences.removeAt(index);
  }

  toggleEndMonth(index: number) {
    const workExperience = this.workExperiences.at(index);
    if (workExperience.get('stillWorking')?.value) {
      workExperience.get('endMonth')?.disable();
    } else {
      workExperience.get('endMonth')?.enable();
    }
  }

  file: any
  onFileSelected(event: any) {
    console.log(event)
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files);
  
      // Prevent duplicate files
      newFiles.forEach(file => {
        if (!this.selectedFiles.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)) {
          this.selectedFiles.push(file);
        }
      });
    }
    this.menteeForm.value.menteeCV = event.target.files[0];
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.preventDefault();
    if (event.dataTransfer?.files) {
      const newFiles = Array.from(event.dataTransfer.files);

      // Prevent duplicate files
      newFiles.forEach(file => {
        if (!this.selectedFiles.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)) {
          this.selectedFiles.push(file);
        }
      });
    }
    this.menteeForm.value.menteeCV = this.selectedFiles;
  }


  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }
 
  onSubmit() {
    // const itemId: any[] = ["d320f2cf-d49c-48b7-9809-0f51ebf3d5b5", "6f1cfe98-87b2-49b0-a8b1-6b0e0db2d2b9"]
    
    // lấy mảng id languge
    this.idLanguage = this.menteeForm.value.menteeLanguage.map((item: { id: any; }) => item.id);
    this.idField = this.menteeForm.value.menteeField.map((item: { id: any; }) => item.id);
    this.router.navigate(['/mentors_list', this.idField]);



    // console.log(this.selectedFiles);
    // const body = 
    // {
    //   Id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //   BasicInformation: {
    //     Avatar: "",
    //     FullName: this.menteeForm.value.menteeFullName,
    //     Email: this.menteeForm.value.menteeEmail,
    //     Phone: this.menteeForm.value.menteePhone,
    //     Gender: this.menteeForm.value.menteeGender,
    //     StudentCode: this.menteeForm.value.menteeStudentCode,
    //     Class: "",
    //     GeneralIntroduction: this.menteeForm.value.menteeReason
    //   },
    //   WorkAndEducation: {
    //     Experiences: [
    //       {
    //         Organisation: this.menteeForm.value.workExperiences[0]['companyName'],
    //         Position: this.menteeForm.value.workExperiences[0]['workPosition'],
    //         StartDate: this.menteeForm.value.workExperiences[0]['startMonth'],
    //         EndDate: this.menteeForm.value.workExperiences[0]['endMonth'],
    //         PositionSummary: this.menteeForm.value.workExperiences[0]['jobDescription']
    //       }
    //     ],
    //     LinkedInUrl:  this.menteeForm.value.menteeLinkedIn,
    //     CVUrl: this.menteeForm.value.menteeCV,
    //     SupervisoryExperience: 0
    //   },
    //   MentoringFields: [
    //     "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    //   ],
    //   ConnectionAndWorkings: [
    //     "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    //   ],
    //   OtherPreferences: ""
    // }
    // this.postService.createMentee(body).subscribe({
    //   next: (data: any) => {
    //     console.log(data)
    //     if(data.data){
    //       console.log("duy")
    //     }
    //   },error: err=>{
    //     console.log(err)
    //     this.toastSerice.showToast({
    //       title: 'Error',
    //       message: err.error.userMsg,
    //       type: 'error',
    //       duration: 5000,
    //     });
    //   }
    // })
  
    // // // if (this.menteeForm.valid) {
    //   console.log(this.menteeForm.value);
    // //   console.log(this.file);
    // //   // Perform the submission logic here
    // // // }
    // // console.log(this.menteeForm);
    
    // if (this.menteeForm.valid) {
    //   // Submit logic
    //   console.log('Form is valid, submitting...');
    // } else {
    //   // Mark all fields as touched to display validation errors
    //   this.markFormGroupTouched(this.menteeForm);
    //   // Mark work experiences as touched
    //   this.workExperiences.controls.forEach(control => {
    //     this.markFormGroupTouched(control as FormGroup);
    //   });
    // }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  handleCheckboxChange(item: any) {
    for (let i = 0; i < this.workingConnectionFilters.length; i++) {
      if (this.workingConnectionFilters[i].id === item.id) {
        this.workingConnectionFilters[i].checked = !this.workingConnectionFilters[i].checked;
        break; // Exit the loop once the item is found and updated
      }
    }
    this.arrayIdConnect = this.workingConnectionFilters.filter(connect => connect.checked).map(connect => connect.id);
    console.log("duytest2", this.arrayIdConnect);

  }
  
}
