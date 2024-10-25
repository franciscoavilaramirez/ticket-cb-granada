export interface Usuario{
  id: string | number,
  nombre?: string,
  email?: string,
  apellidos?: string,
  _admin?: boolean,
  password?: string,
  user_id?: number,
  partidosAsistidos?: number;
  selected?: boolean; 
}
