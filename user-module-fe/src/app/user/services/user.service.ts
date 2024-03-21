import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { Observable } from 'rxjs';
import { User } from 'src/app/data/UserModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * This method creates a user by call the create endpoint
   * @param user
   * @returns Observable<User>
   */
  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, JSON.stringify(user), { headers: this.headers})
  }

  /**
   * This method fetches all users (array) from the DB by calling the fetch endpoint
   * It also filters users by date of birth when supplied, otherwise it fetches all users
   * @param dateFrom
   * @param dateTo
   * @returns Observable<User[]>
   */
  getUsers(dateFrom: string = '', dateTo: string = ''): Observable<User[]> {
    let params: HttpParams = new HttpParams()
      .set('fromDate', dateFrom)
      .set('toDate', dateTo);

    return this.http.get<User[]>(`${this.baseUrl}/users`, { headers: this.headers, params })
  }
}
