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

  constructor(){}
  ngOnInit(): void {}

  getUbicacion(value: string){
    this.searchValue.emit(value);
  }


addSugerencia(event:any , sugerenciasDiv:any){
  let entrada = event.target.value.toUpperCase();
  let existe = false;
  let sugerencia = "";

  for (let item of this.listaLocaliades) {
    if (entrada != "" && item.includes(entrada)) {
      existe = true;
      sugerencia = item;
      }
  }

  if (existe){
    sugerenciasDiv.innerHTML = sugerencia;
    sugerenciasDiv.style.display='block';
  }else{
    sugerenciasDiv.style.display='none';
  }
}


}
