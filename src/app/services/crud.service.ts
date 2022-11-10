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

 /**
  * Obtiene los datos de la tabla servicestations donde la localidad es igual al parámetro
  *
  * @param ubicacion
  * @returns array con resultados
  */
 BuscarPorUbicacion(ubicacion:string):Observable<any>{
  let url = this.API+"?buscar=1&target="+ ubicacion;
  return this.http.get(url);

}

EstadisticasDeUbicacion(ubicacion:string):Observable<any>{
  let url = this.API+"?estadisticas=1&target="+ ubicacion;
  return this.http.get(url);
}


}

