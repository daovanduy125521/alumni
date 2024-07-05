import { PostService } from './../../../services/post.service';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { ImageModelComponent } from '../image-model/image-model.component';
import { Tile } from 'src/app/model/tile';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { finalize } from 'rxjs';
import { COMMENT_PAGE_SIZE } from 'src/app/services/const/const';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],

})
export class PostComponent implements OnInit{
  @Input() postInfo!: any;
  listComment : any[] = [];
  isComment : boolean = false;
  isLoadingComment : boolean = false;
  isSendingComment : boolean = false;
  replyComment : string = "";
  readonly topReply : string = "top";
  totalImage : number = 0;
  readonly tileMax = 3;
  displayTile : Tile[] | null = null;
  commentContent : string = "";
  listImage : string[] = []
  userFullname : string = 'Unknown'
  commentPage: number = 1
  currentPostId : string ="";
  editCommentId : string = "";
  editCommentInfo : any;
  tile1: Tile[] = [
    {imageSrc: '', cols: 4, rows: 4},

  ]

  tile2: Tile[] = [
    {imageSrc: '', cols: 2, rows: 4},
    {imageSrc: '', cols: 2, rows: 4},

  ]

  tile3: Tile[] = [
    {imageSrc: '', cols: 3, rows: 4},
    {imageSrc: '', cols: 1, rows: 2},
    {imageSrc: '', cols: 1, rows: 2},
  ]


  constructor(private datePipe: DatePipe, private postService: PostService, private toastSerice : ToastServiceService, private dialog: MatDialog, private localStorageService: LocalStorageService){}
  ngOnInit(): void {
    this.userFullname = this.localStorageService.getItem("Full_Name");
    this.currentPostId = this.postInfo.id;
    if(this.postInfo.medias){
      this.listImage = this.postInfo.medias.map((image : any) => image.mediaUrl)
      this.totalImage = this.listImage.length
      this.mapToDisplayTile();
    }
    console.log(this.listImage)
  }

  commentText: string = ''; // Initial textarea content
  textareaHeight: number = 50; // Initial height of the textarea

  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.overflow = 'hidden'; // Ensure no scrollbars
    textarea.style.height = 'auto'; // Reset textarea height

    // Set the new textarea height based on content height
    this.textareaHeight = textarea.scrollHeight;
  }

  convertDate(dateString: string): string {
    console.log(dateString)
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'MM-dd-yyyy') || '';
  }

  getPageComment(postId: string){
    this.commentPage = 1;
    this.commentContent = ""
    this.isComment = !this.isComment;
    this.isLoadingComment = true
    if(this.isComment){
      this.replyComment = this.topReply;
      this.postService.getPageCommentByPostId(postId, this.commentPage, COMMENT_PAGE_SIZE).pipe(
        finalize(() => {
          this.isLoadingComment = false;
        })
      ).subscribe({
        next: data =>{
          if(data.data)
          this.listComment = data.data;
        },
        error: err =>{
          console.log(err)
          this.toastSerice.showToast({
            title: 'Error',
            message: err.error.userMsg,
            type: 'error',
            duration: 5000,
          });
        }
      })
    }else{
      this.replyComment = "";
    }

  }

  displayCommentInput(commentId: string){
    this.commentContent = ""
    if(commentId){
      this.replyComment = commentId;
    }
  }

  openImageModelDialog(imgIndex : number){
    this.dialog.open(ImageModelComponent,{
      data: {images: this.listImage, index: imgIndex}
    })
  }

  //Map tile display image with compatible grid layout
  mapToDisplayTile(){
    if(this.listImage.length >= 3){
      this.displayTile = this.deepCopy(this.tile3);
      for (let i = 0; i < 3; i++) {
        this.displayTile[i].imageSrc = this.listImage[i];
      }
    }else if(this.listImage.length == 2){
      this.displayTile = this.deepCopy(this.tile2)
      for (let i = 0; i < 2; i++) {
        this.displayTile[i].imageSrc = this.listImage[i];
      }
    }else if(this.listImage.length == 1){
      this.displayTile = this.deepCopy(this.tile1)
        this.displayTile[0].imageSrc = this.listImage[0];
    }else{
      this.displayTile = null;
    }
  }

 deepCopy<T>(array: T[]): T[] {
    return array.map(item => {
      if (typeof item === 'object' && item !== null) {
        return JSON.parse(JSON.stringify(item));
      }
      return item;
    });
  }

  sendComment(postId:string){
    if(this.isSendingComment){
      return
    }
    this.isSendingComment = true;
    this.postService.createNewCommnet(this.commentContent ,postId).pipe(
      finalize(() => {
        this.isSendingComment = false;
        this.commentContent = "";
      })
    ).subscribe({
      next: (data: any) =>{
        console.log(data.data)
        if (!this.listComment) {
          this.listComment = [];
        }
        if(data.data){
            this.listComment.unshift(data.data);
        }


      }
    })
  }

  sendCommentLV2(postId: string, parrentCommentId: string){
    if(this.isSendingComment){
      return
    }
    this.isSendingComment = true;
    this.postService.createNewCommentLevel2(this.commentContent, postId, parrentCommentId).pipe(
      finalize(() => {
        this.isSendingComment = false;
        this.commentContent = "";
      })
    ).subscribe({
      next: (data : any) =>{
        console.log(data.data)
        let parrenCommnet = this.listComment.find(comment => comment.id == parrentCommentId)
        if(parrenCommnet && data.data){
          if(!parrenCommnet.childComments){
            parrenCommnet.childComments = []
          }
          parrenCommnet.childComments.unshift(data.data);
        }else{
          this.toastSerice.showToast({
            title: 'Error',
            message: "Comment does not exist",
            type: 'error',
            duration: 5000,
          });
        }
      }
    })
  }

  loadMoreComment(postId : string){
    this.commentPage++;
    this.isLoadingComment = true;
    this.postService.getPageCommentByPostId(postId, this.commentPage, COMMENT_PAGE_SIZE).pipe(
      finalize(() => {
        this.isLoadingComment = false;
      })
    ).subscribe({
      next: data =>{
        if(data.data)
        this.listComment.push(...data.data) ;
      },
      error: err =>{

      }
    })
  }

  deleteComment(commentId: string){
    const userConfirmed = confirm("Are you sure to delete this comment?");
    if(commentId && userConfirmed){
      this.postService.deleteComment(commentId).subscribe({
      next: data => {
        const indexToRemove = this.listComment.findIndex(item => item.id === commentId);
        if (indexToRemove > -1) {
          this.listComment.splice(indexToRemove, 1);
        }
        this.toastSerice.showToast({
          title: 'Success',
          message: "Delete comment success",
          type: 'success',
          duration: 5000,
        });
      },
      error: err => {
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

  }

  deleteCommentLeve2(commentId: string, parentCommentId: any){
    const userConfirmed = confirm("Are you sure to delete this comment?");
    console.log(commentId)
    console.log(parentCommentId)
    if(commentId && parentCommentId && userConfirmed){
      this.postService.deleteComment(commentId).subscribe({
      next: data => {
        const parrentComment = this.listComment.find(item => item.id == parentCommentId)
        const indexToRemove = this.listComment.findIndex(item => item.id === commentId);
        this.toastSerice.showToast({
          title: 'Success',
          message: "Delete comment success",
          type: 'success',
          duration: 5000,
        });
      },
      error: err => {
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
  }

  getUserTag(userTags: any[]){
    let result : string = "";
    if(userTags){
      result = ", " + userTags.map(user => '@' +user.fullName).join(', ');
    }
    return result
  }

  getMajorTag(majorTags: any[]){
    let result : string = "";
    if(majorTags){
      result = ", " + majorTags.map(major => '@' +major.tagName).join(', ');
    }
    return result
  }

  getFieldTag(fieldTags: any[]){
    let result : string = "";
    if(fieldTags){
      result = fieldTags.map(field => '@' +field.fieldName).join(', ');
    }
    return result
  }

  updateComment(comment : any){
    this.postService.updateComment(comment).subscribe({
      next: (data: any) => {
        if(data.data){
          const indexToUpdate = this.listComment.findIndex(item => item.id === comment.id);
        if (indexToUpdate > -1) {
          this.listComment[indexToUpdate] = comment
          this.cancelEditComment()
        }
        }
      },error: err=>{
        this.toastSerice.showToast({
          title: 'Error',
          message: err.error.userMsg,
          type: 'error',
          duration: 5000,
        });
      }
    })
  }

  triggerEditComment(comment: any){
    this.editCommentId = comment.id;
    this.editCommentInfo = comment
  }

  cancelEditComment(){
    this.editCommentId ="";

  }

}
