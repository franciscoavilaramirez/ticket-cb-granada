import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getMyUser(): any {
    let userStr = localStorage.getItem('user');
    if (userStr == null)
      return null
    else
      return JSON.parse(userStr)
  }
}
