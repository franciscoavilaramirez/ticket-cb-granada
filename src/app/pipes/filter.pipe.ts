import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform (value: any, arg: any): any {
    console.log('value filterPipe',value)
    if (!value || !arg) {
      return value;
    }
    arg = arg.toLowerCase();
    // return value.filter((post: any) =>   post.nombre.toLowerCase().includes(arg) ||
    //                                      post.apellidos.toLowerCase().includes(arg) ||
    //                                      post.email.toLowerCase().includes(arg)

    // );
    return value.filter((post: any) => {
      const nombreLowerCase = post.nombre ? post.nombre.toLowerCase() : '';
      const apellidosLowerCase = post.apellidos ? post.apellidos.toLowerCase() : '';
      const emailLowerCase = post.email ? post.email.toLowerCase() : '';
      const equipoVisitanteLowerCase = post.equipoVisitante ? post.equipoVisitante.toLowerCase() : '';
      const fechaPartidoLowerCase = post.fechaPartido ? post.fechaPartido.toLowerCase() : '';

      return nombreLowerCase.includes(arg) ||
             apellidosLowerCase.includes(arg) ||
             emailLowerCase.includes(arg) ||
             equipoVisitanteLowerCase.includes(arg) ||
             fechaPartidoLowerCase.includes(arg);
    });

  }
}


