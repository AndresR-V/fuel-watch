import { Component, OnInit } from '@angular/core';
import { CarburantesService } from'./services/carburantes.service';
import { CrudService } from './services/crud.service';

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
  public UbicacionABuscar:string = "";
  public datosConsulta:any;




  constructor(private crudService:CrudService) { }

// esta funcion se ejecuta el pulsar el boton buscar

ubicacionABuscar(Item_busqueda: string) {
  console.log(Item_busqueda);
  this.UbicacionABuscar = Item_busqueda.toUpperCase();
  console.log("Buscando...");
  this.crudService.BuscarPorUbicacion(
  this.UbicacionABuscar).subscribe(result => {
  this.datosConsulta =result;
  console.log(this.datosConsulta);
  this.arrayTarjetas=[];
  for (const n of Object.keys(this.datosConsulta)) {

    console.log(this.datosConsulta[n]);
    this.arrayTarjetas.push(
      {
        marca: this.datosConsulta[n]["rotulo"],
        precios: [
                      { tipo: "Diesel",       precio:  this.datosConsulta[n]["precio_diesel"] },
                      { tipo: "Diesel +",     precio:  this.datosConsulta[n]["precio_diesel_extra"] },
                      { tipo: "Gasolina 95",  precio:  this.datosConsulta[n]["precio_gasolina_95"]},
                      { tipo: "Gasolina 98",  precio:  this.datosConsulta[n]["precio_gasolina_98"]},
                    ]
      }


    );
  }

});



  //   for (const item of this.datosConsulta){


  //     this.arrayTarjetas.push(
  //       {
  //         marca: item["Rótulo"],
  //         precios: [
  //             { tipo: "Diesel",       precio:  item["Precio Gasoleo A"] },
  //             { tipo: "Diesel +",     precio:  item["Precio Gasoleo Premium"] },
  //             { tipo: "Gasolina 95",  precio:  item["Precio Gasolina 95 E5"]},
  //             { tipo: "Gasolina 98",  precio:  item["Precio Gasolina 98 E5"]},
  //           ]
  //        }

  //     );
  //  }







}

ngOnInit():void {




}

  // constructor(service: CarburantesService){

  //   this.apiData = service.getData().subscribe( bruto => {
  //     this.datosCarburantes =  bruto.ListaEESSPrecio;
  //     for (const item of this.datosCarburantes){
  //       if (item.Localidad == "VIGO") {
  //         this.arrayTarjetas.push(
  //               {
  //                       marca: item["Rótulo"],
  //                       precios: [
  //                           { tipo: "Diesel",       precio:  item["Precio Gasoleo A"] },
  //                           { tipo: "Diesel +",     precio:  item["Precio Gasoleo Premium"] },
  //                           { tipo: "Gasolina 95",  precio:  item["Precio Gasolina 95 E5"]},
  //                           { tipo: "Gasolina 98",  precio:  item["Precio Gasolina 98 E5"]},
  //                         ]
  //                     }

  //         )
  //           }
  //         }
  //         });

  // }

  // ngOnInit():void {


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


  // }// end OnInit

}
