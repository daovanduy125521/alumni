import { ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import {  startWith } from 'rxjs/operators';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { dateLessThanTodayValidator } from 'src/app/shared/validator/date.validator';
import { MatAutocompleteSelectedEvent,  } from '@angular/material/autocomplete';
import { Item } from 'src/app/model/item';
import { CommonApiService } from 'src/app/services/common-api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  currentYear: number = new Date().getFullYear();
  roles!: Item[];


  isSSORegister = false;
  listCountry : any;
  listState : any;
  userForm!: FormGroup;
  submitted = false;
  userObject : any;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  fieldCtrl = new FormControl('');
  filteredField!: Observable<string[]>;
  fields: Item[] = [];
  allFieldTittle: string[] = [];
  allField: Item[]=[];
  @ViewChild('fieldInput') fieldInput!: ElementRef<HTMLInputElement>;

  constructor(private formBuilder: FormBuilder, private userService : UserServiceService, private route: Router, private activateRoute: ActivatedRoute,
    private toastService: ToastServiceService, private commonAPI: CommonApiService, private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {

    this.activateRoute.queryParams.subscribe((params : any) => {
      if(Object.keys(params).length > 0){
        this.isSSORegister = true;
        this.userObject = params;
      }
    });
    this.userService.getProvince().subscribe({
      next: countriesData =>{this.listCountry = countriesData},
      error: err => console.error('Observable emitted an error: ' + err),
      complete: () => console.log('Observable emitted the complete notification')
    })

    this.getAllField();
    this.userForm = this.formBuilder.group(
      {
        emailLogged  :[( this.isSSORegister ? this.userObject.emailLogged : "") ,[Validators.required, Validators.email]],
        // roleId :["", [Validators.required]],
        fullName : ["", [Validators.required]],
        gender : ["",[Validators.required]],
        studentCode : [""],
        dateOfBirth : ["", [Validators.required, dateLessThanTodayValidator()]],
        // major : [""],
        // class : [""],
        isGraduated : ["",[Validators.required]],
        // graduationYear : ["", Validators.max(this.currentYear)],
        // phoneNumber : [""],
        country : ["", [Validators.required]],
        city : ["", [Validators.required]],
        // fieldIds: [this.fields.map(field => field.id)]
      },
    );
  }

  get emailLogged() { return this.userForm.get('emailLogged'); }
  get fullName() { return this.userForm.get('fullName'); }
  get gender() { return this.userForm.get('gender'); }
  get studentCode() { return this.userForm.get('studentCode'); }
  get dateOfBirth() { return this.userForm.get('dateOfBirth'); }
  get major() { return this.userForm.get('major'); }
  get classControl() { return this.userForm.get('classControl'); }
  get isGraduated() { return this.userForm.get('isGraduated'); }
  get graduationYear() { return this.userForm.get('graduationYear'); }
  get phoneNumber() { return this.userForm.get('phoneNumber'); }
  get country() { return this.userForm.get('country'); }
  get city() { return this.userForm.get('city'); }
  get isSSO() { return this.userForm.get('isSSO'); }

   setFieldIds(listField : string[]){
    this.userForm.controls['fieldIds'].setValue(listField);
  }


  submitUserForm(): void {
    if (this.userForm.valid) {
      console.log(this.userForm.value)

      this.userService.registerUser(this.userForm.value).subscribe({
        next: data => {
          this.toastService.showToast({
          title: 'Register success',
          message: 'Pleas check your email and login',
          type: 'success',
          duration: 5000,
        });
        this.route.navigate(["/login"])},
        error: err => console.log("Error to register user")
      })
    }else{
      console.log(this.userForm.get('emailLogged')?.invalid)
      this.userForm.markAllAsTouched();
    }
  }

  modelChange(contry: any){
    this.findAllStateByCountry(contry.value)
    // console.log(event.target.value);
    }

  findAllStateByCountry(selectedCountry : any){
    if(selectedCountry.states){
      this.listState = selectedCountry.states;
    }
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

    showSuccessToast() {
      this.toastService.showToast({
        title: 'This is info',
        message: 'This is a success message',
        type: 'info',
        duration: 5000,
      });
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

    remove(fieldToDelete: string): void {
      this.fields = this.fields.filter(fields => fields.id !== fieldToDelete);
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

}
