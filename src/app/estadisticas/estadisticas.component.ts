import { Component, OnInit ,Input } from '@angular/core';
@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

   // para conectar con otros componentes
   @Input() stats:any;

  constructor() { }

  ngOnInit(): void {
  }

}
