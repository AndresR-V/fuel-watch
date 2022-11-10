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

  getUbicacion(value: string){
    this.searchValue.emit(value);
  }




}
