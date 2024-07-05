import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { confirmPasswordValidator } from 'src/app/shared/validator/confirmPasswordValidator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{
  token : string = '';
  userId : string = '';
  resetForm! : FormGroup;
  constructor(private router : Router, private formBuilder: FormBuilder, private authService: AuthServiceService, private activateRoute: ActivatedRoute){

  }
  ngOnInit(): void {
    this.activateRoute.queryParams.pipe(
      switchMap(params => {
       this.token = params['token'];


        // Call another API using the retrieved token
        return this.authService.checkForgotPassword(this.token);
      })
    ).subscribe({
      next: (data : any) => {
        if(data.data){
          this.userId = data.data.id;
        }else{
          this.router.navigate(['not_found'])
        }
      },
      error: error => console.log(error)
    });
    // this.authService.checkForgotPassword(token).subscribe({
    //   next: data=> console.log(data)
    // })

    this.resetForm = this.formBuilder.group({
      password : ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword : ['', [Validators.required]]
    },{ validators: confirmPasswordValidator })

  }


submitResetForm() {
  if(this.resetForm.valid)
  this.authService.changeForgotPassword(this.userId, this.token, this.confirmPassword?.value).subscribe({
    next : data =>{console.log(data)},
    error : error => {console.log(error)}
  });
}

navigateToLogin() {
  this.router.navigate(['login'])
}

get password(){
  return this.resetForm.get("password")
}
get confirmPassword(){
  return this.resetForm.get("confirmPassword")
}
}
