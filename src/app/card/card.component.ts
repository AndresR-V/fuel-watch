import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faGasPump, faLock, faLockOpen, faLocationDot, faMapLocation } from '@fortawesome/free-solid-svg-icons';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})

export class CardComponent implements OnInit {



  // para conectar con otros componentes
  @Input() dataApi: any;
  @Input() stats: any;
  @Output() favoritos = new EventEmitter<any>();


  faGasPump = faGasPump;
  faLock = faLock;
  faLockOpen = faLockOpen;
  faLocation = faLocationDot;

  imagen: any;

  // esquema de colores para los gráficos de histórico de precios
  colorScheme: Color = {
    domain: ['#EA8254', '#0db9f0', '#21C4A6', '#333f50'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };


  ngOnInit(): void {

  }





  public anclar(event: any) {
    event.preventDefault();

    this.favoritos.emit(
      {
        id: event.target.parentNode.parentNode.parentNode.parentNode.id,
        active: this.dataApi.favorito ? false : true
      }
    );
  }

}

