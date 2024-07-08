import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { PostService } from 'src/app/services/post.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';
declare var $: any;

@Component({
  selector: 'app-mentors-list',
  templateUrl: './mentors-list.component.html',
  styleUrls: ['./mentors-list.component.css']
})
export class MentorsListComponent {
  idArray!: any[];
  workingConnectionFilters!: any[];
  languageFilters!: any[];
  // mentors: { id: string, name: string, skills: any, position: string ; }[] | undefined;
  mentors: any[] | undefined;
  arrayIdLanguage: any[] | undefined;
  arrayIdConnect: any[] | undefined;
  reportForm: FormGroup;
  @ViewChild('exampleModal')
  exampleModal!: ElementRef;
  constructor(private route: ActivatedRoute, 
    private postService: PostService, 
    private toastSerice : ToastServiceService, 
    private fb: FormBuilder, 
    private renderer: Renderer2, 
    private elementRef: ElementRef,
    private router: Router
  ) { 
    this.reportForm = this.fb.group({
      evidence: [null],
      description: ['']
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idArray = Object.values(params);
    });
    const body = {
      FieldIds: this.idArray
    }
    this.postService.filterMentors(body).subscribe({
      next: (data: any) => {
        console.log("duy",data)
        if(data.data){
            this.workingConnectionFilters = data.data.connectionAndWorkings.map((item: any) => ({ ...item, checked: false }));
            console.log("duytesst",  this.workingConnectionFilters )
            this.languageFilters = data.data.languages.map((item: any) => ({ ...item, checked: false }));
    
          this.mentors = data.data.mentorings;
        }
      },error: err=>{
        console.log(err)
        this.toastSerice.showToast({
          title: 'Error',
          message: err.error.userMsg,
          type: 'error',
          duration: 5000,
        });
      }
    })
  }
  



  

  selectedMentor: any = null;

  selectMentor(mentor: any) {
    this.selectedMentor = mentor;
  }


  handleCheckboxChange() {
    this.arrayIdLanguage = this.languageFilters.filter(language => language.checked).map(language => language.id);
    this.arrayIdConnect = this.workingConnectionFilters.filter(connect => connect.checked).map(connect => connect.id);
    const body = {
      LanguageIds: this.arrayIdLanguage,
      ConnectionAndWorkings: this.arrayIdConnect
    }
    this.callApifilterMentors(body, false);
  }

  callApifilterMentors(body: any, isFist: boolean) {
    
    this.postService.filterMentors(body).subscribe({
      next: (data: any) => {
        console.log("duy",data)
        if(data.data){
          if(isFist) {
            this.workingConnectionFilters = data.data.connectionAndWorkings.map((item: any) => ({ ...item, checked: false }));
            this.languageFilters = data.data.languages.map((item: any) => ({ ...item, checked: false }));
          }
          this.mentors = data.data.mentorings;
        }
      },error: err=>{
        console.log(err)
        this.toastSerice.showToast({
          title: 'Error',
          message: err.error.userMsg,
          type: 'error',
          duration: 5000,
        });
      }
    })
  }

  onReport() {
    if (this.reportForm.valid) {
      // Logic xử lý khi form hợp lệ và nút "Report" được nhấn
      console.log('Form Value:', this.selectedMentor);
      const body = {
        ReporterId: "",
        VictimId: this.selectedMentor.id,
        Description: this.reportForm.value.description,
        AdditionalInformation: this.reportForm.value.evidence
      }
      this.postService.createMentorReport(body).subscribe({
        next: (data: any) => {
          const modalElement = this.elementRef.nativeElement.querySelector('#btn-close');
           modalElement.click();
        },error: err=>{
          console.log(err)
          this.toastSerice.showToast({
            title: 'Error',
            message: err.error.userMsg,
            type: 'error',
            duration: 5000,
          });
        }
      })
    } else {
      console.log('Form is invalid');
    }
  }

  close(){
    this.reportForm.reset();
  }

  redirectDetail(mentor: any) {
    console.log(mentor);
    const mentorId =  mentor.id
    this.router.navigate(['/mentor_profile', mentorId]);
  }
}
