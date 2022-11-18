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
  @Output() searchValue = new EventEmitter<string>();


  constructor(){}
  ngOnInit(): void {}

  getUbicacion(value: string){
    this.searchValue.emit(value);
  }




}
