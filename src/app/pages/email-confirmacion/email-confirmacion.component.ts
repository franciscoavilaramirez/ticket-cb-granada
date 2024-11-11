import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-email-confirmacion',
  templateUrl: './email-confirmacion.component.html',
  styleUrl: './email-confirmacion.component.css'
})
export class EmailConfirmacionComponent implements OnInit{
  
  email: string = '';
  href: string = '';

  constructor(private http: HttpClient, private router: Router, private translate: TranslateService, private apiService: ApiService){
    
    this.href = this.router.url;
    if(this.href.includes('=')){
      this.email = this.href.substring(this.href.lastIndexOf('?')+1,this.href.length-1);
    }else{
      this.email = this.href.substring(this.href.lastIndexOf('?')+1,this.href.length);
    }
  }

  ngOnInit(): void {
    Swal.fire({
      title: 'Por favor pulse el boton para confirmar el email',
      confirmButtonText: 'Finalizar',
      confirmButtonColor: 'green',
    }).then((response) => {
      if (response.isConfirmed) {
        this.apiService.confirmarEmail(this.email).subscribe( (success) =>{
          this.router.navigate(['/']);
          Swal.fire("Email confirmado", "", "success");
        });
      }
    });
  }

  

}
