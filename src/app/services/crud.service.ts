import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CrudService {

API: string = 'http://localhost/FuelWatch_php/BackEnd/crud.php'
  constructor( private client:HttpClient) { }

 BuscarPorUbicacion(ubicacion:string):Observable<any>{
  return this.client.get(this.API+"?buscar=1&target="+ ubicacion)
 }
}

