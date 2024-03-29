import { Component, OnInit } from '@angular/core';
import { CarburantesService } from './services/carburantes.service';
import { CrudService } from './services/crud.service';
import { CookieService } from 'ngx-cookie-service';
import { cL } from 'chart.js/dist/chunks/helpers.core';
import { end } from '@popperjs/core';

interface Tarjeta {
  id: string;
  rotulo: string;
  precios: any[];
  direccion: string;
  horario?: string;
  longitud: string;
  latitud: string;
  localidad?: string;
  historico: any;
  favorito?: boolean;
  fecha: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  title = 'FuelWatch';
  apiData: any;

  public userLocation?: [number, number];
  public arrayTarjetas: Tarjeta[] = [];
  public objetoEstadisticas = {};

  public fechaActualizacion: string = "";

  public UbicacionABuscar: string = "";
  public datosConsulta: any;
  public estadisticas: any = [];

  public precioMin: number = 0.5;
  public precioMax: number = 3.0;

  public listadoMarcas: string[] = [];
  public marcaSeleccionada = 'TODAS';

  public itemBusqueda: string = "";
  public combustiblesMostrar: boolean[] = [true, true, true, true]

  // guarda la lista de id_ss favoritas
  public arrayFavoritos: string[] = [];

  // public  arrayFavoritos = ["275","335","14482","14483"];

  public datosaconsultaFavoritos: any;

  public rangosPrecio = {
    target: 0,
    min: 0,
    max: 0,
  };


  public historico: any = [];

  public listaLocaliades: any[] = [];

  public listaCP: number[] = [];
  public isCP: boolean = false;
  public loadCompleted: boolean = false;



  constructor(private crudService: CrudService, private cookieService: CookieService) {

    let cookie = this.cookieService.get('favoritos');
    if (cookie) {
      for (let fav of JSON.parse(cookie)) {
        this.arrayFavoritos.push(fav);
      }
    }



  }

  // esta funcion se ejecuta el pulsar el boton buscar

  ubicacionABuscar(Item_busqueda: string, isCP: boolean = false) {
    this.loadCompleted = false;
    this.arrayTarjetas = [];
    this.itemBusqueda = Item_busqueda;

    console.log(Item_busqueda);
    this.UbicacionABuscar = Item_busqueda.toUpperCase();
    console.log("Buscando...");



    // console.log("this.estadicas"+this.estadisticas);

    // busca los datos de servicestations
    this.crudService.BuscarPorUbicacion(
      this.UbicacionABuscar, isCP).subscribe(result => {
        // obtiene datos de estadisticas
        this.crudService.EstadisticasDeUbicacion(
          this.UbicacionABuscar, isCP).subscribe(result => {

            if (result['estadisticas'][this.UbicacionABuscar]) {


              // datos de estadísticas
              this.estadisticas = result['estadisticas'][this.UbicacionABuscar];
              this.objetoEstadisticas =
              {
                diesel_min: this.estadisticas['diesel']['min'],
                diesel_max: this.estadisticas['diesel']['max'],
                diesel_avg: this.estadisticas['diesel']['avg'],
                diesel_extra_min: this.estadisticas['diesel_extra']['min'],
                diesel_extra_max: this.estadisticas['diesel_extra']['max'],
                diesel_extra_avg: this.estadisticas['diesel_extra']['avg'],
                gasolina95_min: this.estadisticas['gasolina_95']['min'],
                gasolina95_max: this.estadisticas['gasolina_95']['max'],
                gasolina95_avg: this.estadisticas['gasolina_95']['avg'],
                gasolina98_min: this.estadisticas['gasolina_98']['min'],
                gasolina98_max: this.estadisticas['gasolina_98']['max'],
                gasolina98_avg: this.estadisticas['gasolina_98']['avg']
              };

              // se establecen los valores min y max del slider de precios con un margen de 20 centimos  por abajo
              this.precioMin = this.estadisticas['general']['min'] - 0.2;
              this.precioMax = this.estadisticas['general']['max'];


            }

          },
            (error) => console.error(error),
            () => { this.loadCompleted = true }

          );


        // datos estadciones de servicio

        if (result['eess']) {


          this.datosConsulta = result['eess'];

          this.arrayTarjetas = [];
          this.obtenerFavoritos();
          this.refresh_cards(this.datosConsulta);
        }
      });


  }



  public async refresh_cards(datosConsulta?: any, fav = false) {

    // se prodece a vaciar el array de tarjetas para no duplicar datos
    if (!fav) {
      this.listadoMarcas = [];
    }

    if (datosConsulta) {


      for (const n of Object.keys(datosConsulta)) {

        if (!this.listadoMarcas.includes(datosConsulta[n]["rotulo"])) this.listadoMarcas.push(datosConsulta[n]["rotulo"]);

        this.arrayTarjetas = this.arrayTarjetas.filter(tarjeta => tarjeta.id != datosConsulta[n]["id_ss"]);


        this.arrayTarjetas.push(
          {
            id: datosConsulta[n]["id_ss"],
            rotulo: datosConsulta[n]["rotulo"],
            precios: [
              { tipo: "Diesel", precio: datosConsulta[n]["precio_diesel"], show: this.combustiblesMostrar[0] },
              { tipo: "Diesel +", precio: datosConsulta[n]["precio_diesel_extra"], show: this.combustiblesMostrar[1] },
              { tipo: "Gasolina 95", precio: datosConsulta[n]["precio_gasolina_95"], show: this.combustiblesMostrar[2] },
              { tipo: "Gasolina 98", precio: datosConsulta[n]["precio_gasolina_98"], show: this.combustiblesMostrar[3] },
            ],
            direccion: datosConsulta[n]['direccion'],
            horario: datosConsulta[n]['horario'],
            longitud: datosConsulta[n]['longitud'].replace(",", "."),
            latitud: datosConsulta[n]['latitud'].replace(",", "."),
            localidad: datosConsulta[n]['localidad'],
            historico: this.formatearHistorico(datosConsulta[n]["historico"]),
            favorito: this.arrayFavoritos.includes(datosConsulta[n]["id_ss"]),
            fecha: datosConsulta[n]["fecha_actualizacion"]
          }
        );



        // se filtran las tarjetas fuera del rango seleccionado en el slider
        this.arrayTarjetas = this.arrayTarjetas.filter(tarjeta =>
          tarjeta.precios[this.rangosPrecio.target].precio > this.rangosPrecio.min &&
          tarjeta.precios[this.rangosPrecio.target].precio < this.rangosPrecio.max
        );


        // se filtran las tarjetas cullos precios estén desmarcados o sean 0
        this.arrayTarjetas = this.arrayTarjetas.filter(tarjeta =>
          (tarjeta.precios[0].show && tarjeta.precios[0].precio > 0) ||
          (tarjeta.precios[1].show && tarjeta.precios[1].precio > 0) ||
          (tarjeta.precios[2].show && tarjeta.precios[2].precio > 0) ||
          (tarjeta.precios[3].show && tarjeta.precios[3].precio > 0)
        );


        // ordenamos array por el combustible que tengamos seleccionado
        this.arrayTarjetas.sort((a, b) => {
          return a.precios[this.rangosPrecio.target].precio - b.precios[this.rangosPrecio.target].precio;
        });

        let fecha = datosConsulta[n]["fecha_actualizacion"].split(' ')[0];
        let ano = fecha.split('-')[0];
        let mes = fecha.split('-')[1];
        let dia = fecha.split('-')[2];

        this.fechaActualizacion = dia + '-' + mes + '-' + ano;


      }
    }



  }





  formatearHistorico(datos_historico?: any) {



    const seriesDiesel = [];
    const seriesDieselplus = [];
    const seriesGasolina95 = [];
    const seriesGasolina98 = [];
    let arrayhistorico = [];

    let dieselExiste = true;
    let dieselplusExiste = true;
    let gasolina95Existe = true;
    let gasolina98Existe = true;

    if (datos_historico) {
      // console.log('Object.keys(this.datosConsulta).length: '+Object.keys(this.datosConsulta).length)

      for (const n of Object.keys(datos_historico)) {
        try {
          // console.log("#### HISTORICO DE : "+ JSON.parse(datos_historico[n]['precios'])[0]);


          if (Number(JSON.parse(datos_historico[n]['precios'])[0]) == 0) dieselExiste = false;
          if (Number(JSON.parse(datos_historico[n]['precios'])[1]) == 0) dieselplusExiste = false;
          if (Number(JSON.parse(datos_historico[n]['precios'])[2]) == 0) gasolina95Existe = false;
          if (Number(JSON.parse(datos_historico[n]['precios'])[3]) == 0) gasolina98Existe = false;


          seriesDiesel.push(
            {
              'name': datos_historico[n]['fecha'],
              'value': Number(JSON.parse(datos_historico[n]['precios'])[0]),
            }
          )

          seriesDieselplus.push(
            {
              'name': datos_historico[n]['fecha'],
              'value': Number(JSON.parse(datos_historico[n]['precios'])[1]),
            }
          )
          seriesGasolina95.push(
            {
              'name': datos_historico[n]['fecha'],
              'value': Number(JSON.parse(datos_historico[n]['precios'])[2]),
            }
          )

          seriesGasolina98.push(
            {
              'name': datos_historico[n]['fecha'],
              'value': Number(JSON.parse(datos_historico[n]['precios'])[3]),
            }
          )

        } catch (error) {
          //
        }
      }
    }

    if (dieselplusExiste) {
      arrayhistorico.push(
        {
          name: 'Diesel',
          series: seriesDiesel,
        },
        {
          name: 'Diesel+',
          series: seriesDieselplus,
        },
        {
          name: 'Gasolina 95',
          series: seriesGasolina95,
        },
        {
          name: 'Gasolina 98',
          series: seriesGasolina98,
        }
      )
    } else if (gasolina98Existe) {
      arrayhistorico.push(
        {
          name: 'Diesel',
          series: seriesDiesel,
        },
        {
          name: 'Gasolina 95',
          series: seriesGasolina95,
        },
        {
          name: 'Gasolina 98',
          series: seriesGasolina98,
        }
      );
    } else if (gasolina95Existe) {
      arrayhistorico.push(
        {
          name: 'Diesel',
          series: seriesDiesel,
        },
        {
          name: 'Gasolina 95',
          series: seriesGasolina95,
        },);
    }


    //  console.log("arrayhistorico---- "+ JSON.stringify(arrayhistorico) )

    return arrayhistorico;




  }



  items_to_Show(combustibles?: any) {

    if (combustibles) {
      console.log(combustibles);

      this.combustiblesMostrar[0] = combustibles['diesel'];
      this.combustiblesMostrar[1] = combustibles['dieselPlus'];
      this.combustiblesMostrar[2] = combustibles['gasolina95'];
      this.combustiblesMostrar[3] = combustibles['gasolina98'];

      if (this.itemBusqueda != "") {
        this.arrayTarjetas = [];
        this.obtenerFavoritos();
        this.refresh_cards(this.datosConsulta);

      }
      // console.log("combustiblesMostrar: "+this.combustiblesMostrar)

    }

  }

  anclar(favorito: any) {
    console.log("favorito " + favorito.active);

    if (favorito.active) {
      if (!this.arrayFavoritos.includes(favorito.id)) this.arrayFavoritos.push(favorito.id)
    } else {
      this.arrayFavoritos = this.arrayFavoritos.filter(item => item != favorito.id);

      this.refresh_cards(this.datosConsulta);


    }
    // this.obtenerFavoritos();
    // this.arrayTarjetas=[];
    this.obtenerFavoritos();


    console.log("array favoritos: " + this.arrayFavoritos);


  }

  async rangoMostrar(rango: any) {


    this.rangosPrecio.target = rango.target ? rango.target : 0;
    this.rangosPrecio.min = rango.min;
    this.rangosPrecio.max = rango.max;
    // console.log("rango=>  target:"+ this.rangosPrecio.target+" min:"+rango.min+" max:"+rango.max);

    if (this.itemBusqueda != "") {

      // alert(this.arrayTarjetas[1].precios[0].precio);
      // this.arrayTarjetas = this.arrayTarjetas.filter(tarjeta =>
      //   tarjeta.precios[this.rangosPrecio.target].precio > this.rangosPrecio.min &&
      //   tarjeta.precios[this.rangosPrecio.target].precio < this.rangosPrecio.m
      //   );


      this.arrayTarjetas = [];
      await this.obtenerFavoritos();
      this.refresh_cards(this.datosConsulta);

      console.log("this.arrayTarjetas   " + this.arrayTarjetas)
    }


  }

  public async getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude];
          resolve(this.userLocation);
        },

        (err) => {
          console.log(err);
          reject();
        }
      );
    });
  }

  async ngOnInit() {


    // se obtienen los favoritso guardados
    this.obtenerFavoritos();

    // obtenemos la ubicacion del navegador del
    await this.getUserLocation();
    // alert(this.userLocation);

    await this.crudService.BuscarPorCoordenadas(
      this.userLocation).subscribe(result => {

        if (Object.values(result)[0]) {
          this.UbicacionABuscar = Object.values(result)[0];

          console.log('this.UbicacionABuscar_  ' + Object.values(result)[0])

          this.ubicacionABuscar(this.UbicacionABuscar);
        }
      });


    // Se obtiene el listado de localidades de la Buscando


    await this.crudService.obtenerListaLocalidades().subscribe(result => {

      this.listaLocaliades = [];
      this.listaCP = [];

      if (Object.keys(result)) {
        for (let i = 0; i < Object.keys(result).length; i++) {
          this.listaLocaliades.push(Object.values(result)[i]['localidad']);
          this.listaCP.push(Number(Object.values(result)[i]['cp']));
        }
        // elimina duplicados
        this.listaLocaliades = [...new Set(this.listaLocaliades)];
        this.listaCP = [...new Set(this.listaCP)];
      }

      // console.log(this.listaLocaliades)


    });



  }


  obtenerFavoritos() {
    // se obtiene los favoritos
    this.crudService.obtenerFavoritos(this.arrayFavoritos).subscribe(result => {
      this.datosaconsultaFavoritos = []

      if (Object.values(result)) {
        this.datosaconsultaFavoritos = Object.values(result);

        this.refresh_cards(this.datosaconsultaFavoritos, true);

        // guardamos el archivo de cookies

        this.cookieService.set('favoritos', JSON.stringify(this.arrayFavoritos), 365);

      }

    });
  }


  seleccionarMarca(event?: any) {
    if (event.target) {
      console.log('this.marcaSeleccionada: ' + event.target.value)
      this.marcaSeleccionada = event.target.value;
    }

  }

}
