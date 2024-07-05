import { AuthServiceService } from './../../../services/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit{

  forgotForm! : FormGroup;
  constructor(private router : Router, private formBuilder: FormBuilder, private authService: AuthServiceService){

  }
  ngOnInit(): void {
    this.forgotForm = this.formBuilder.group({
      email : ['', [Validators.required, Validators.email]]
    })
  }

submitForgotForm() {
  if(this.forgotForm.valid)
  this.authService.sendResetPasswordEmail(this.forgotForm.value).subscribe({
    next : data =>{console.log(data)},
    error : error => {console.log(error)}
  });
}

navigateToLogin() {
  this.router.navigate(['login'])
}

get email(){
  return this.forgotForm.get("email")
}



}
