import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'src/app/data/UserModel';
import { UserService } from '../services/user.service';
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  public userForm!: FormGroup;
  public errors: Error = { email: '', password: ''};
  public isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService
  ) {}


  ngOnInit(): void {
    this.createUserForm();
  }

  /**
   * This method creates the user form and initializes the fields
   * @returns void
   */
  createUserForm(): void {
    this.userForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      email: [''],
      password: [''],
      dateOfBirth: ['']
    });
  }

  /**
   * This method collects data from the user form,
   * validates input and call user creation API to persist created user in DB
   * @returns void
   */
  createUser(): void {
    this.isLoading = true;

    const formValues = this.userForm.getRawValue();
    const isEmailValid: boolean = this.validateEmail(formValues.email);
    const isPassWordValid: boolean = this.validatePassword(formValues.password);

    if (isEmailValid && isPassWordValid) {
      const user: User = {
        ...formValues
      }

      this.userService.createUser(user)
      .subscribe({
        next: (res: User) => {
          this.messageService.add(
            { severity:'success', summary:'Success;', detail: `User with email ${res?.email} successfully created!` }
          );
          this.isLoading = false;
          this.userForm.reset();
        },
        error: (err) => {
          this.messageService.add(
            { severity:'error', summary:'Cannot get users', detail: err.error.message }
          );
          this.isLoading = false;
        }
      });
    }

  }

  /**
   * This method validates the email for correct format and returns true or false
   * @param email
   * @returns boolean
   */
  validateEmail(email: string): boolean {
    const emailPattern: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailPattern.test(email)) {
      this.errors.email = 'Email is invalid. Enter a correct email';
      return false;
    }

    this.errors.email = '';
    return true;
  }

  /**
   * This method validates the password and returns true or false for correct and incorrect email respectively
   * A valid password must contain:
   *    at least 8 characters, one lowercase, one uppercase, one number & one special character
   * @param password
   * @returns boolean
   */
  validatePassword(password: string): boolean {
    const lowercaseRegex: RegExp = /[a-z]/;
    const uppercaseRegex: RegExp = /[A-Z]/;
    const numberRegex: RegExp = /[0-9]/;
    const symbolRegex: RegExp = /[$&+,:;=?@#|'<>.^*()%!-]/;

    if (password.length < 8 || !lowercaseRegex.test(password) ||
        !uppercaseRegex.test(password) || !numberRegex.test(password) ||
        !symbolRegex.test(password)) {
          const lengthError = password.length < 8 ? '8 characters' : '';
          const lowercaseError = !lowercaseRegex.test(password) ? ', one lowercase letter' : '';
          const uppercaseError = !uppercaseRegex.test(password) ? ', one uppercase letter' : '';
          const numberError = !numberRegex.test(password) ? ', one number' : '';
          const symbolError = !symbolRegex.test(password) ? ', one special character': '';
          this.errors.password = "Password must contain: " + lengthError + lowercaseError + uppercaseError + numberError +  symbolError;
        return false;
    };

    this.errors.password = '';
    return true;
  }

  /**
   * This method clears the error message from email or password
   * checks the field name (either email or password)
   * @param fieldName
   * @returns void
   */
  clearError(fieldName: string): void {
    fieldName === 'email' ? this.errors.email = '' : this.errors.password = '';
  }

}

export interface Error {
  email: string,
  password: string
}
