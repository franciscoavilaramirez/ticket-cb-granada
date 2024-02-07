import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  @Input() isAdmin = false
  user: any;
  ngOnInit(): void {
    let userStr = localStorage.getItem('user');
    if(userStr != null) {
      let user = JSON.parse(userStr);
      this.isAdmin = user.isAdmin
      console.log(user)
      console.log("isAdmin: " + user.isAdmin)
    }
  }
}
