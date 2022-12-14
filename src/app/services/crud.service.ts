import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})

export class CrudService {
  corsHeaders;

  API: string = '';



  constructor(private http: HttpClient) {
    this.corsHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '/'
    });



    console.log("###############isDevMode()= " + isDevMode());
    if (isDevMode()) {
      this.API = 'http://localhost/FuelWatch_php/BackEnd/crud.php'
    } else {
      this.API = '../BackEnd/crud.php';
    }

  }

  /**
   * Obtiene los datos de la tabla servicestations donde la localidad es igual al parámetro
   *
   * @param ubicacion
   * @returns array con resultados
   */
  BuscarPorUbicacion(ubicacion: string, isCP = false): Observable<any> {
    let cp = isCP ? 1 : 0;

    let url = this.API + "?buscar=1&estadisticas=1&cp=" + cp + "&target=" + ubicacion;
    return this.http.get(url);

  }

  EstadisticasDeUbicacion(ubicacion: string, isCP = false): Observable<any> {
    let cp = isCP ? 1 : 0;
    let url = this.API + "?estadisticas=1&cp=" + cp + "&target=" + ubicacion;
    return this.http.get(url);
  }


  BuscarPorCoordenadas(coords: any) {
    let url = this.API + "?coord=1&lon=" + coords[0] + "&lat=" + coords[1];
    return this.http.get(url);
  }

  obtenerFavoritos(favs: any) {
    let url = this.API + "?favoritos=1&listado=" + JSON.stringify(favs);
    return this.http.get(url);
  }

  obtenerListaLocalidades() {
    let url = this.API + "?localidades=1";
    return this.http.get(url);
  }

}


