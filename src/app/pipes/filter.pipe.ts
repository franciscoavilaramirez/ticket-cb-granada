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
    return value.filter((post: any) =>  post.nombre.toLowerCase().includes(arg) ||
                                        post.apellidos.toLowerCase().includes(arg) ||
                                        post.email.toLowerCase().includes(arg)
    );
  }
}


