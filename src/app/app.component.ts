import { Component, OnInit } from '@angular/core';
import { CarburantesService } from'./services/carburantes.service';
import { CrudService } from './services/crud.service';

interface Tarjeta{
  id: string;
  rotulo:string;
  precios:any[];
  direccion:string;
  horario?:string;
  longitud:string;
  latitud:string;
}




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  title = 'Fuel-Watch';
  apiData : any;

  public userLocation?:[number,number];
  public arrayTarjetas: Tarjeta[] = [];
  public objetoEstadisticas = {};

  public hola:string = "";

  public UbicacionABuscar:string = "";
  public datosConsulta:any;
  public estadisticas:any = [];

  public itemBusqueda:string ="";
  public combustiblesMostrar:boolean[]=[true,true,true,true]

  public rangosPrecio = {
    target: 0,
    min: 0,
    max:0,
  };



  constructor(private crudService:CrudService) {

  }

// esta funcion se ejecuta el pulsar el boton buscar

ubicacionABuscar(Item_busqueda: string) {
  this.itemBusqueda = Item_busqueda;

  console.log(Item_busqueda);
  this.UbicacionABuscar = Item_busqueda.toUpperCase();
  console.log("Buscando...");




  // console.log("this.estadicas"+this.estadisticas);

  // busca los datos de servicestations
  this.crudService.BuscarPorUbicacion(
  this.UbicacionABuscar).subscribe(result => {
    // obtiene datos de estadisticas
  this.crudService.EstadisticasDeUbicacion(
    this.UbicacionABuscar).subscribe(result => {

      // datos de estadísticas
    this.estadisticas = result['estadisticas'][this.UbicacionABuscar];
      this.objetoEstadisticas =
        {
        diesel_min        : this.estadisticas['diesel']['min'],
        diesel_max        : this.estadisticas['diesel']['max'],
        diesel_avg        : this.estadisticas['diesel']['avg'],
        diesel_extra_min  : this.estadisticas['diesel_extra']['min'],
        diesel_extra_max  : this.estadisticas['diesel_extra']['max'],
        diesel_extra_avg  : this.estadisticas['diesel_extra']['avg'],
        gasolina95_min    : this.estadisticas['gasolina_95']['min'],
        gasolina95_max    : this.estadisticas['gasolina_95']['max'],
        gasolina95_avg    : this.estadisticas['gasolina_95']['avg'],
        gasolina98_min    : this.estadisticas['gasolina_98']['min'],
        gasolina98_max    : this.estadisticas['gasolina_98']['max'],
        gasolina98_avg    : this.estadisticas['gasolina_98']['avg']
      };




  });

  // datos estadciones de servicio
  this.datosConsulta = result['eess'];

  this.refresh_cards();




});


}



public refresh_cards(){

  // se prodece a vaciar el array de taarjetas para no duplicar datos
  this.arrayTarjetas=[];

  for (const n of Object.keys(this.datosConsulta)) {

    // console.log(this.datosConsulta[n]);

    let target = "";

    switch (this.rangosPrecio.target){
      case 0:
        target = "precio_diesel";
        break;
      case 1:
        target = "precio_diesel_extra";
        break;
      case 2:
        target = "precio_gasolina_95";
        break;
      case 3:
        target = "precio_gasolina_98";
        break;
    }
    // compropbamos rango precios:

    // console.log(" [target] ="+ target)
    // console.log(" this.rangosPrecio.min ="+ this.rangosPrecio.min)
    // console.log(" this.rangosPrecio.max ="+ this.rangosPrecio.max)

    if(
      this.datosConsulta[n][target] != 0 &&
      this.datosConsulta[n][target] >= this.rangosPrecio.min &&
      this.datosConsulta[n][target] <= this.rangosPrecio.max
      ){

      this.arrayTarjetas.push(
        {
          id: this.datosConsulta[n]["id_ss"],
          rotulo: this.datosConsulta[n]["rotulo"],
          precios: [
                        { tipo: "Diesel",       precio:  this.datosConsulta[n]["precio_diesel"],       show:this.combustiblesMostrar[0] },
                        { tipo: "Diesel +",     precio:  this.datosConsulta[n]["precio_diesel_extra"], show:this.combustiblesMostrar[1]  },
                        { tipo: "Gasolina 95",  precio:  this.datosConsulta[n]["precio_gasolina_95"],  show:this.combustiblesMostrar[2] },
                        { tipo: "Gasolina 98",  precio:  this.datosConsulta[n]["precio_gasolina_98"],  show:this.combustiblesMostrar[3] },
                      ],
        direccion:this.datosConsulta[n]['direccion'],
        horario:this.datosConsulta[n]['horario'],
        longitud:this.datosConsulta[n]['longitud'].replace(",", "."),
        latitud:this.datosConsulta[n]['latitud'].replace(",", ".")
        }


      );
  }

  }
}

items_to_Show(combustibles:any){

  console.log(combustibles);

    this.combustiblesMostrar [0] = combustibles['diesel'];
    this.combustiblesMostrar [1] = combustibles['dieselPlus'];
    this.combustiblesMostrar [2] = combustibles['gasolina95'];
    this.combustiblesMostrar [3] = combustibles['gasolina98'];

    if (this.itemBusqueda!="")  this.refresh_cards();
    console.log("combustiblesMostrar: "+this.combustiblesMostrar)
}

rangoMostrar(rango:any){


  this.rangosPrecio.target = rango.target ? rango.target : 0;
  this.rangosPrecio.min = rango.min;
  this.rangosPrecio.max = rango.max;
  // console.log("rango=>  target:"+ this.rangosPrecio.target+" min:"+rango.min+" max:"+rango.max);

  if (this.itemBusqueda!="") this.refresh_cards();


}

public async getUserLocation(): Promise <[number,number]>{
  return new Promise( ( resolve, reject ) => {

    navigator.geolocation.getCurrentPosition(
      ({ coords}) => {
        this.userLocation =  [coords.longitude, coords.latitude];
        resolve (this.userLocation);
      },

      ( err ) => {
        console.log(err);
        reject();
      }
    );
  });
}

async ngOnInit() {

// obtenemos la ubicacion del navegador del
  await this.getUserLocation();
  // alert(this.userLocation);

  await this.crudService.BuscarPorCoordenadas(
    this.userLocation).subscribe(result=> {
      this.UbicacionABuscar = Object.values(result)[0];
      this.ubicacionABuscar(this.UbicacionABuscar);
    });



}


}
