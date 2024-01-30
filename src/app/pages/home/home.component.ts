import { Component, Renderer2 } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Partido } from '../../modelo/partido';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private apiService: ApiService, private renderer: Renderer2) {
    this.renderer.setStyle(document.body, 'background', 'url("../../../assets/imgs/pista-baloncesto.png")');
    this.renderer.setStyle(document.body, 'background-size', 'cover');
    this.renderer.setStyle(document.body, 'background-repeat', 'no-repeat');
    this.renderer.setStyle(document.body, 'background-attachment', 'fixed');
  }
  
  idUsuario:number
  partidos: Partido[]
  misPartidosIds: number[]
  ngOnInit() {
    let user = localStorage.getItem('user');
    if(user == null)
      this.idUsuario = -1
    else {
      let userJson = JSON.parse(user);
      this.idUsuario = parseInt(userJson.userId)
      console.log("id usuario: " + this.idUsuario)
    }
    this.apiService.getMisPartidosIds(this.idUsuario).subscribe(response => {
      this.misPartidosIds = response
      this.apiService.getProximosPartidos().subscribe(response => {
        if(response != null) {
          this.partidos = response
          this.partidos.forEach(partido => {
            if (this.misPartidosIds != null && this.misPartidosIds.includes(partido.id))
              partido.tengoEntrada = true;
            else
              partido.tengoEntrada = false;
          })
        }
        console.log("Partidos: "+this.partidos)
        console.log("Mis partidos ids: "+this.misPartidosIds)
      });
    });
  }

  apuntarse(idPartido: number) {
    this.apiService.asignarEntrada(this.idUsuario, idPartido).subscribe(response => {
      if(response == true) {
        console.log("response: " + response)
        this.partidos.forEach(partido => {
          if (partido.id == idPartido)
            partido.tengoEntrada = true;
        });
      } else {
        alert("No quedan entradas")
      }
    })

  }

  desapuntarse(idPartido: number) {
    this.apiService.desasignarEntrada(this.idUsuario, idPartido).subscribe(()=>{
      this.partidos.forEach(partido => {
        if (partido.id == idPartido) {
          partido.tengoEntrada = false;
          partido.stockEntradas = true;
        }
      });
    })

  }

  descargar(idPartido: number, nombrePartido: string) {
    this.apiService.getEntradaBase64(this.idUsuario, idPartido).subscribe(data => {
      let blob = this.base64ToBlob(data, "application/pdf")
      this.saveBlobAsTextFile(blob, nombrePartido+'.pdf')
    });
  }

  base64ToBlob(base64String:string, contentType = ''): Blob {
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    const byteArray = new Uint8Array(byteArrays);
    return new Blob([byteArray], { type: contentType });
  }

  saveBlobAsTextFile(blob: Blob, fileName: string): void {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

}
