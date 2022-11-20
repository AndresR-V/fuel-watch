import { Component, OnInit ,Input, Output, EventEmitter} from '@angular/core';
import { faGasPump,faLock,faLockOpen, faLocationDot, faMapLocation } from '@fortawesome/free-solid-svg-icons';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})

export class CardComponent implements OnInit {



  // para conectar con otros componentes
  @Input() dataApi:any;
  @Input() stats:any;
  @Output() favoritos = new EventEmitter<any>();


  faGasPump = faGasPump;
  candado = faLock;
  faLocation= faLocationDot;

  anclado:boolean= false;

  // esquema de colores para los gráficos de histórico de precios
  colorScheme:Color = {
    domain: ['#EA8254', '#0db9f0', '#21C4A6', '#333f50'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };

  ngOnInit(): void {

    this.candado = this.anclado ? faLock : faLockOpen;

  }



  // candado = this.anclado ? faLock : faLockOpen;

  public anclar(event: any) {
    event.preventDefault();

    this.anclado =  this.anclado? false : true;

    console.log('this.anclado'+this.anclado)

    let id_favorito = event.target.parentNode.parentNode.parentNode.parentNode.id;

    this.candado = this.anclado ? faLock : faLockOpen;

    this.favoritos.emit(
      {
        id: id_favorito,
        active: this.anclado
      }
    );
  }

}

