import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})

export class SearchBarComponent implements OnInit {

  formSearchBar = new FormControl('',[]);

  @Output() searchValue = new EventEmitter<string>();
  constructor(){}
  ngOnInit(): void {}

  // constructor(
  //   public formulario:FormBuilder,
  //   private crudService:CrudService
  // ) {

  //   this.formSearchBar=this.formulario.group({
  //     target:['']
  //   });

  // }

  // ngOnInit(): void {
  // }

  // getUbicacion(event:Event):any{
  //   event.preventDefault();
  //   let value = this.formSearchBar.value;
  //   console.log(value)
  //   if (value) this.searchValue.emit(value.toUpperCase());


  // }
  getUbicacion(value: string){
    this.searchValue.emit(value);
  }


  // buscarUbicacion(): any {
  //   console.log("Buscando...");

  //   // enviamos texto en mayusculas
  //   let target = this.formSearchBar.value.target.toUpperCase();

  //   console.log( target );


  //   this.searchResults = this.crudService.BuscarPorUbicacion(target).subscribe();
  // }
}
