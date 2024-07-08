import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-mentor-profile',
  templateUrl: './mentor-profile.component.html',
  styleUrls: ['./mentor-profile.component.css']
})
export class MentorProfileComponent implements OnInit {
  idMentor: any;
  mentorDetail: any;
  reportForm: FormGroup;

  constructor(
    private route: ActivatedRoute, 
    private postService: PostService, 
    private elementRef: ElementRef,
    private toastSerice : ToastServiceService, 
    private fb: FormBuilder, 
  ) {
    this.reportForm = this.fb.group({
      evidence: [null],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idMentor = params;
    });

    this.postService.getMentorDetail(this.idMentor.params.id).subscribe({
      next: (data: any) => {
        this.mentorDetail = data.data;     
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
    console.log("duy", this.mentorDetail)
  }

  selectedMentor: any = null;

  onReport() {
    if (this.reportForm.valid) {
      // Logic xử lý khi form hợp lệ và nút "Report" được nhấn
      const body = {
        ReporterId: "",
        VictimId: this.mentorDetail.id,
        Description: this.reportForm.value.description,
        AdditionalInformation: this.reportForm.value.evidence
      }
      console.log('Form Value:', this.reportForm.value);
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
  
  
}
  // Add any additional methods or properties if needed


