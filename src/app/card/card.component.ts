import { Component, OnInit ,Input } from '@angular/core';
import { faGasPump } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {


  // para conectar con otros componentes
  @Input() dataEntrante:any;

  constructor() { }

  ngOnInit(): void {

  }

  faGasPump = faGasPump;

  boton ='ver mas';

  botonVerMas(): void {
    this.boton = this.boton=='ver mas' ?  'ver menos' : 'ver mas';

  }





}
