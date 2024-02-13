import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  // transform(value: any, arg: any): any {
  //   let resultPost: any = [];

  //   if(arg.length <= 0 ){
  //     resultPost = value;
  //     console.log('return', resultPost);
  //     return resultPost;
  //   }else{
  //     for(let post of value){
  //       console.log('value',value)
  //       if(post.nombre.includes(arg)){
  //         console.log('nombre:',post.nombre);
  //         resultPost.push(post);
  //       }
  //     }

  //     return resultPost;
  //   }
  // }
  transform(value: any, arg: any): any {
    if (!value || !arg) {
      return value;
    }
    arg = arg.toLowerCase(); // Convertir el término de búsqueda a minúsculas para comparar indistintamente mayúsculas y minúsculas
    return value.filter((post: any) =>
      post.nombre.toLowerCase().includes(arg) || post.apellidos.toLowerCase().includes(arg)
    );
  }


}


