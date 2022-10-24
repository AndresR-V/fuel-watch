import { Component, OnInit } from '@angular/core';
import { CarburantesService } from'./services/carburantes.service';


interface Tarjeta{
  marca:string;
  precios:any[];
  numero?:number;
}

// interface Item{
//     'Localidad':string;
//     'Rótulo':string;
//     'Dirección':string;
//     'Precio Gasoleo A':string;
//     'Precio Gasoleo Premium':string;
//     'Precio Gasolina 95 E5':string;
//     'Precio Gasolina 98 E5':string;
//   };


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Fuel-Watch';

 apiData : any;

  public arrayTarjetas: Tarjeta[] = [];
  public datosCarburantes: any = [];


  constructor(service: CarburantesService){

    this.apiData = service.getData().subscribe( bruto => {
      this.datosCarburantes =  bruto.ListaEESSPrecio;
      for (const item of this.datosCarburantes){
        if (item.Localidad == "VIGO") {
          this.arrayTarjetas.push(
                {
                        marca: item["Rótulo"],
                        precios: [
                            { tipo: "Diesel",       precio:  item["Precio Gasoleo A"] },
                            { tipo: "Diesel +",     precio:  item["Precio Gasoleo Premium"] },
                            { tipo: "Gasolina 95",  precio:  item["Precio Gasolina 95 E5"]},
                            { tipo: "Gasolina 98",  precio:  item["Precio Gasolina 98 E5"]},
                          ]
                      }

          )
            }
          }
          });

  }

  ngOnInit():void {


    // for (const item of this.datosCarburantes){

      // if (item.Localidad == "VIGO") {
      //   this.arrayTarjetas.push(
      //     {
      //       marca: item["Rótulo"],
      //       precios: [
      //           { tipo: "Diesel",       precio:  item["Precio Gasoleo A"] },
      //           { tipo: "Diesel +",     precio:  item["Precio Gasoleo Premium"] },
      //           { tipo: "Gasolina 95",  precio:  item["Precio Gasolina 95 E5"]},
      //           { tipo: "Gasolina 98",  precio:  item["Precio Gasolina 98 E5"]},
      //         ]
      //      }

      //   );
      // }

      //   // console.log(datos[i]["Rótulo"]);
      //   // console.log(datos[i]["Dirección"]);
      //   // console.log(datos[i]["Precio Gasoleo A"]);
      //   // console.log(datos[i]["Precio Gasoleo Premium"]);
      //   // console.log(datos[i]["Precio Gasolina 95 E5"]);
      //   // console.log(datos[i]["Precio Gasolina 98 E5"]);


    // this.arrayTarjetas = [
    //   {
    //     marca: this.datosCarburantes,
    //     precios: [
    //         { tipo: "Diesel", precio: 1.35 },
    //         { tipo: "Diesel +", precio: 1.35 },
    //         { tipo: "Gasolina 95", precio: 1.45},
    //         { tipo: "Gasolina 98", precio: 1.50},
    //       ]
    //    },
    //    {
    //     marca: 'Shell',
    //     precios: [
    //         { tipo: "Diesel", precio: 1.91 },
    //         { tipo: "Diesel +", precio: 1.99 },
    //         { tipo: "Gasolina 95", precio: 1.80},
    //         { tipo: "Gasolina 98", precio: 1.85},
    //       ]
    //    }
    // ];


  }// end OnInit

}
