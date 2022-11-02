import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  formSearchBar: FormGroup;
  constructor(
    public formulario:FormBuilder,
    private crudService:CrudService
  ) {

    this.formSearchBar=this.formulario.group({
      target:['']
    });

  }

  ngOnInit(): void {
  }

  buscarUbicacion(): any {
    console.log("Buscando...");

    // enviamos texto en mayusculas
    let target = this.formSearchBar.value.target.toUpperCase();

    console.log( target );


    this.crudService.BuscarPorUbicacion(target).subscribe();
  }
}
