import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})

export class CrudService {
corsHeaders;
API: string = 'http://localhost/FuelWatch_php/BackEnd/crud.php'

constructor( private http:HttpClient) {
  this.corsHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '/'});
 }

 BuscarPorUbicacion(ubicacion:string):Observable<any>{
  // return this.http.get(this.API+"?buscar=1&target="+ ubicacion)
  let url = this.API+"?buscar=1&target="+ ubicacion;
  return this.http.get(url);
}



}

