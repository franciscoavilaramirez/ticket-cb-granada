/*
he hecho esta interfaz porque es lo que me devuelve el servidor cuando hago login
se que hay otra pero he hecho esta y no he modificado por si la utilizais
*/

export interface LoginResponse {
  user_id: string;
  nombre: string;
  apellido: string;
  password: string;
  email: string;
  tickets: any[];
  _admin: boolean;
}
