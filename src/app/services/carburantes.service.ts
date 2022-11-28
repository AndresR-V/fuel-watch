import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

interface Bruto{
  Fecha:string;
  ListaEESSPrecio: Object;
  Nota:string;
  ResultadoConsulta: string;
};



@Injectable({
  providedIn: "root"
})

export class CarburantesService {

  private bruto: Bruto = { Fecha: "", ListaEESSPrecio: "", Nota: "", ResultadoConsulta: "" };
  private url:string = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";
  corsHeaders;


  constructor(private http: HttpClient) {

    this.corsHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '/'});
  }

  public getData(): Observable<Bruto> {

     return this.http.get<Bruto>(this.url);

    // this.http.get(this.url).subscribe( bruto => {
    //   console.log(bruto);

    // });


  }



  // makeFileRequest() {
  //     let xhr = new XMLHttpRequest();
  //     xhr.open("GET", this.url);
  //     xhr.send();
  //     xhr.addEventListener("load", () => JSON.parse(xhr.response));

  // }


 //   listarData(bruto.ListaEESSPrecio);

// const load_xml = () => {
//   let resultados = "";
//   console.log("cargado");
//   bruto = JSON.parse(xhr.response);
//   listarData(bruto.ListaEESSPrecio);
// };

// function listarData(datos) {
//   console.log("listarData");
//   for (let i = 0; i < datos.length; i++) {
//     // resultados.innerHTML += datos[i].Dirección;
//     if (datos[i].Localidad == "VIGO") {
//       console.log(datos[i]["Rótulo"]);
//       console.log(datos[i]["Dirección"]);
//       console.log(datos[i]["Precio Gasoleo A"]);
//       console.log(datos[i]["Precio Gasoleo Premium"]);
//       console.log(datos[i]["Precio Gasolina 95 E5"]);
//       console.log(datos[i]["Precio Gasolina 98 E5"]);
//     }
//   }
// }
}
// propiedades del objeto
/*
    # C.P.
    # Dirección
    # Horario
    IDCCAA
    IDEESS
    IDMunicipio
    IDProvincia
    # Latitud
    # Localidad
    # Longitud (WGS84)
    Margen
    # Municipio
    Precio Biodiesel
    Precio Bioetanol
    Precio Gas Natural Comprimido
    Precio Gas Natural Licuado
    Precio Gases licuados del petróleo
    # Precio Gasoleo A
    Precio Gasoleo B
    # Precio Gasoleo Premium
    # Precio Gasolina 95 E5
    Precio Gasolina 95 E5 Premium
    Precio Gasolina 95 E10
    # Precio Gasolina 98 E5
    Precio Gasolina 98 E10
    Precio Hidrogeno
    # Provincia
    Remisión
    # Rótulo
    Tipo Venta

*/
