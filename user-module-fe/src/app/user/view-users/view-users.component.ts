import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/data/UserModel';
import { UserService } from '../services/user.service';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit{

  public filterForm!: FormGroup
  public users: User[] = [];
  public isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.getUsers();
    this.createFilterForm();
  }

  /**
   * This method fetches all users from the DB (calls the userService method)
   * @returns void
   */
  getUsers(): void {
    this.isLoading = true;

    this.userService.getUsers()
      .subscribe({
        next: (res: User[]) => {
          this.users = res
          this.isLoading = false;
        },
        error: (err) => {
          this.messageService.add(
            { severity:'error', summary:'Cannot get users', detail: err.error.message },
          );
          this.isLoading = false;
        }
      });
  }

  /**
   * This method creates the filter form to filter users by date of birth
   * @returns void
   */
  createFilterForm(): void {
    this.filterForm = this.fb.group({
      dateFrom: [''],
      dateTo: ['']
    });
  }

  /**
   * This method filters users by date of birth
   * Validates that the from date is not greater than the to date
   */
  filterUsers(): void {

    this.isLoading = true;
    const {dateFrom, dateTo} = this.filterForm.getRawValue();

    if (dateFrom > dateTo ) {
      this.messageService.add(
        { severity:'error', summary:'Date Error', detail: 'From Date cannot be greater than To Date' },
      );
      return;
    }

    this.userService.getUsers(dateFrom, dateTo)
      .subscribe({
        next: (res: User[]) => {
          this.users = res;
          this.isLoading = false;
        },
        error: (err) => {
          this.messageService.add(
            { severity:'error', summary:'Cannot get users', detail: err.error.message },
          );
          this.isLoading = false;
        }
      })
  }

}
