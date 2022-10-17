import { Component, OnInit } from '@angular/core';

interface Tarjeta{
  marca:string;
  precios:any[];
  numero?:number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Fuel-Watch';




  public arrayTarjetas: Tarjeta[] = [];

  ngOnInit():void {
    this.arrayTarjetas = [
      {
        marca: 'Repsol',
        precios: [
            { tipo: "Diesel", precio: 1.35 },
            { tipo: "Diesel +", precio: 1.35 },
            { tipo: "Gasolina 95", precio: 1.45},
            { tipo: "Gasolina 98", precio: 1.50},
          ]
       },
       {
        marca: 'Shell',
        precios: [
            { tipo: "Diesel", precio: 1.91 },
            { tipo: "Diesel +", precio: 1.99 },
            { tipo: "Gasolina 95", precio: 1.80},
            { tipo: "Gasolina 98", precio: 1.85},
          ]
       }
    ];
  }



}
