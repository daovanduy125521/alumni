import { Router } from '@angular/router';
import { Observable, Subject, combineLatest, finalize, switchMap, map } from 'rxjs';
import { ChangeDetectorRef, Component } from '@angular/core';
import { CreatePostDialogComponent } from '../../user-profile/create-post-dialog/create-post-dialog.component';
import { Item } from 'src/app/model/item';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UserServiceService } from 'src/app/services/user-service.service';
import { PostService } from 'src/app/services/post.service';
import { ImageCloudService } from 'src/app/services/image-cloud.service';
import { DatePipe } from '@angular/common';
import { CommonApiService } from 'src/app/services/common-api.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
// import { v4 as uuidv4 } from 'uuid';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-alumni-group',
  templateUrl: './alumni-group.component.html',
  styleUrls: ['./alumni-group.component.css'],
  providers: [DatePipe],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', [
        animate(300)
      ]),
    ])
  ]
})
export class AlumniGroupComponent {

  userSetting? :any;
  userId : string ="";
  allField : Item[]= [];
  previewUrls: string[] = [];
  selectedFiles: File[] = [];
  selectedUserTagId: string[]= [];
  selectUserName: string[]= [];
  selectedMajor : Item[] = [];
  selectedField : Item[] = [];
  selectedPostCategory : string = "";
  content: string =""
  isDisplayPostCreate = false;
  isPublic: boolean = true
  searchTerm$ = new Subject<string>();
   Editor = ClassicEditor;
   editorData = '<p>Hello, world!</p>';
   userInput = '';
   fieldInput = '';
   majorInput = '';
  listPost: any[]=[];
  filteredUsers: any[] = [];
  listImagePath: string[]=[];
  listAllMajorTag: Item[]= [];
  listSuggestedMajorTag: Item[]= [];
  listAllFieldTag: Item[]= [];
  listSuggestedFieldTag: Item[]= [];
  listPostCategory: Item[] =  [];
  isCreatePost : boolean = false;
  isShowUserMajorTag: boolean = false;
  currentUserFullname : string = "";
  constructor(private userService: UserServiceService, private datePipe: DatePipe, private router : Router, private comonAPI : CommonApiService, private dialog: MatDialog,
    private postService: PostService, private cdr: ChangeDetectorRef, private imageCloud: ImageCloudService, private formBuilder : FormBuilder, private toastService : ToastServiceService,
    private localStorageService: LocalStorageService
  ){
  }
  ngOnInit(): void {

    this.userService.getUserSetting().subscribe({
      next: (data : any) => {
        if(data.data.staff){
          this.userSetting = data.data.staff;
        }else if(data.data.alumni){
          this.userSetting = data.data.alumni;
        }
        console.log(this.userSetting)
        this.postService.getGroupPost().subscribe({
          next: (data: any) => {
            if(data){
              this.listPost = data.data;
              console.log(this.listPost)
            }
          }
        })
        this.cdr.detectChanges();
      }
    })

    this.postService.getAllField().subscribe({
      next: (data: any) => {
        if(data.data){
           this.listAllFieldTag = data.data.map((item: any) => ({
          title: item.fieldName,
          id: item.id
        }));
        }
        console.log(this.listAllFieldTag)
      },
      error: err =>{
        console.log(err)
      }
    })

    this.postService.getAllPostCategory().subscribe({
      next: (data: any) => {
        if(data.data){
           this.listPostCategory = data.data.map((item: any) => ({
          title: item.categoryName,
          id: item.id
        }));
        }
        console.log(this.listPostCategory)
      },
      error: err =>{
        console.log(err)
      }
    })
    // this.comonAPI.getAllFields().subscribe({
    //   next : (data : any) =>{
    //     this.allField = data.data.map((field :any) => ({
    //       title : field.fieldName,
    //       id : field.id
    //     }))}
    // })


  }

  openDialog() {
    const dialogRef = this.dialog.open(CreatePostDialogComponent, {width: '800px'});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  convertDate(dateString: string): string {
    console.log(dateString)
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'MM-dd-yyyy') || '';
  }

  convertMonthYear(dateString: string): string {
    let date = new Date(dateString);
    let formattedDate = this.datePipe.transform(date, 'MMMM yyyy');
    if (formattedDate !== null) {
      return formattedDate;
    } else {
      return 'Invalid Date'; // Handle the case where date formatting fails
    }
  }

  onUserTagChanged(): void {
    console.log(this.userInput)
    if (this.userInput.length > 0 && this.userInput.charAt(0) === '@') {
      const searchTerm = this.userInput.substring(1).toLowerCase();
      this.postService.getTagsByKeyword(searchTerm).subscribe({
        next : (data: any) =>{
          this.filteredUsers= data.data;
          console.log(this.filteredUsers);
        },
        error: err=>{
          this.filteredUsers = [];
        }
      })

    } else {
      this.filteredUsers = [];
    }
  }

  onMajorTagChange(){
    if(this.majorInput){

        this.listSuggestedMajorTag = this.listAllMajorTag.filter(item => {
        const result = item.title.toLowerCase().includes(this.majorInput.toLowerCase())
        return result;
      })

    }
  }

  onFieldTagChange(){
    if(this.fieldInput){

        this.listSuggestedFieldTag = this.listAllFieldTag.filter(item => {
        const result = item.title.toLowerCase().includes(this.fieldInput.toLowerCase())
        return result;
      })

    }
  }

  selectUser(user:any): void {
    if(user && user.id && user.fullName){
      this.selectedUserTagId.push(user.id);
      this.selectUserName.push("@"+user.fullName)
    }
    console.log(this.selectUserName);
    this.userInput = ''; // Clear the input after selecting a user
    this.filteredUsers = []; // Clear suggestions
  }

  selectField(field: Item): void {
    if(field){
      this.selectedField.push(field)
    }
    console.log(this.selectUserName);
    this.fieldInput = ''; // Clear the input after selecting a field
    this.listSuggestedFieldTag = []; // Clear suggestions
  }

  selectMajor(major: Item): void {
    if(major){
      this.selectedMajor.push(major)
    }
    console.log(this.selectUserName);
    this.majorInput = ''; // Clear the input after selecting a major
    this.listSuggestedMajorTag = []; // Clear suggestions
  }

  navigateToSetting(){
    this.router.navigate(['setting'])
  }

  getFieldTitleById(id : string){
    let name = this.allField.find(item => item.id == id)
    if(name){
      return name.title;
    }
    return null;
  }

  toogleCreatePost(){
    this.isDisplayPostCreate = !this.isDisplayPostCreate;
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      Array.from(fileInput.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrls.push(reader.result as string);
        };
        reader.readAsDataURL(file);
        this.selectedFiles.push(file);
      });
    }
  }

  removeImage(index: number): void {
    this.previewUrls.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  onUpload(): void {
    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('files', file, file.name);
    });

    // this.http.post('your-api-endpoint-here', formData).subscribe(response => {
    //   console.log('Upload response', response);
    // });
  }

  uploadImage(file: File): Observable<number | undefined> {
    const filePath = `images/postImage/${file.name}`;
    this.listImagePath.push(filePath);
    return this.imageCloud.updateImage(file, filePath)
  }

  uploadImages(files: File[]): Observable<(number | undefined)[]> {
    const uploadObservables: Observable<number | undefined>[] = [];
    files.forEach(file => {
      uploadObservables.push(this.uploadImage(file));
    });

    return combineLatest(uploadObservables);
  }



  getImageCloud(path: any){
    let url = ""
    if(path && path.mediaUrl){
      console.log("inside get image")
      return this.imageCloud.getImageUrl(path.mediaUrl).subscribe({
        next: data => {console.log(data)}
      });
    }
    console.log("outside get image")
    return "string";
  }

  createGroupPost(){
    const fieldTags = this.selectedField.map(item => item.id);
    const majorTags = this.selectedMajor.map(item => item.id)
    if(fieldTags.length == 0){
      this.toastService.showToast({
        title: 'Invalid info',
        message: 'Please choose at least one field tag',
        type: 'warning',
        duration: 5000,
      });
      return;
    }
    if(!this.selectedPostCategory){
      this.toastService.showToast({
        title: 'Invalid info',
        message: 'Please select type of post',
        type: 'warning',
        duration: 5000,
      });
      return;
    }
    if(this.selectedFiles.length >=1){
      this.isCreatePost = true;
        this.imageCloud.uploadFiles(this.selectedFiles).pipe(
          switchMap(listUrl => {
            return this.postService.createPostInGroup(this.isPublic, this.content, this.selectedUserTagId, listUrl, this.selectedPostCategory, fieldTags, majorTags );
          }),
          finalize(() => this.isCreatePost = false)
        ).subscribe({
          next: result =>{
            console.log(result)
            this.toastService.showToast({
              title: 'Create Success',
              message: 'Add Post Successfully',
              type: 'success',
              duration: 5000,
            });
          },error: err =>{
            this.toastService.showToast({
              title: 'Error',
              message: 'Add Post Failed',
              type: 'error',
              duration: 5000,
            });
          }
        })
      }else{
        this.postService.createPostInGroup(this.isPublic, this.content, this.selectedUserTagId, [], this.selectedPostCategory, fieldTags, majorTags ).subscribe({
          next: data => {
            console.log(data)
          },
          error: err =>{
            console.log(err)
          }
        })
      }



  }

  loadUserMajorTag(){
    this.isShowUserMajorTag = !this.isShowUserMajorTag;
    if(this.isShowUserMajorTag){
          this.postService.getAllMajor().subscribe({
      next: (data: any) => {
        if(data.data){
          this.listAllMajorTag = data.data.map((item: any)=>({
            title: item.tagName,
            id : item.id
          }));
        }
      },
      error: err =>{
        console.log(err)
      }
    })
    }

  }

  get selectedFieldTitles(): string {
    return this.selectedField.map(field => '@' +field.title).join(', ');
  }

  get selectedMajorTitles(): string{
    return this.selectedMajor.map(field => '@' +field.title).join(', ');
  }
}

