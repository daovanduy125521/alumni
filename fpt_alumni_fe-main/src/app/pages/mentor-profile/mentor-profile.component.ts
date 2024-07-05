import { Component, OnInit } from '@angular/core';
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

  constructor(
    private route: ActivatedRoute, 
    private postService: PostService, 
    private toastSerice : ToastServiceService, 
  ) { }

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
  
  
}
  // Add any additional methods or properties if needed


