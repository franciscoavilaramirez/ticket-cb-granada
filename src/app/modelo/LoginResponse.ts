/*
he hecho esta interfaz porque es lo que me devuelve el servidor cuando hago login
se que hay otra pero he hecho esta y no he modificado por si la utilizais
*/

export interface LoginResponse {
  userEmail: string;
  isAdmin: boolean;
  userName: string;
  userId: string;
  userApellidos: string;
}
