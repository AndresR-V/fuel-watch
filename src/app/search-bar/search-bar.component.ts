import { Component, OnInit, Input } from '@angular/core';
import { FormControl , Validators } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})


export class SearchBarComponent implements OnInit {

  formSearchBar = new FormControl('',[Validators.required]);

  @Input() ubicacion = "";
  @Input() listadoMarcas = [];
  @Input() listaLocaliades:any[]=[];
  @Output() searchValue = new EventEmitter<string>();

  ubicacionABuscar:string= "";

  constructor(){}
  ngOnInit(): void {}

  getUbicacion(value: string){
    if (this.ubicacionABuscar!=""){
      this.searchValue.emit(this.ubicacionABuscar);
    }

  }


addSugerencia(event:any , sugerenciasDiv:any){
  let entrada = event.target.value.toUpperCase();
  let existe = false;
  let sugerencia = "";



  // editamos la entrada de datos

  let palabras = entrada.split(" ");
  let primeraletra = "a";
  let localidad:string[] = [];


  for( let palabra of palabras.reverse()){
      if (palabra.length > 2 && palabra!="LAS" && palabra!="LOS"){
        localidad.push(palabra);
        primeraletra = palabra[0];

      }
  }

  // console.log('localidad a buscar : ' + localidad);
  // console.log('primera letra : ' + primeraletra);

  for (let item of this.listaLocaliades) {
    if (item.includes(localidad[0])  && item[0] == primeraletra && item.includes(localidad[1]) && item.includes(localidad[2])) {
      existe = true;
      sugerencia = item;
      }else if(item.includes(localidad[0])  && item[0] == primeraletra && item.includes(localidad[1])){
        existe = true;
        sugerencia = item;
      }else if(item.includes(localidad[0])  && item[0] == primeraletra){
        existe = true;
        sugerencia = item;
      // }else if(item.includes(localidad[0])) {
      //   existe = true;
      //   sugerencia = item;
      }

  }

  console.log('sugerencia : ' + sugerencia);

  if (existe){
    sugerenciasDiv.innerHTML = sugerencia;
    sugerenciasDiv.style.display='block';
    this.ubicacionABuscar = sugerencia;
  }else{
    sugerenciasDiv.style.display='none';
  }
}


}
