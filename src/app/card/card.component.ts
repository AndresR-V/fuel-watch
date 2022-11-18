import { Component, OnInit ,Input } from '@angular/core';
import { faGasPump, faLock,faLockOpen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})

export class CardComponent implements OnInit {



  // para conectar con otros componentes
  @Input() dataApi:any;
  @Input() stats:any;



  ngOnInit(): void {
    this.anclado =  this.anclado? false : true;
    this.candado = this.anclado ? faLock : faLockOpen;
  }

  private anclado:boolean = true;
  faGasPump = faGasPump;
  candado = faLock;
  // candado = this.anclado ? faLock : faLockOpen;

  public anclar(event: any) {
    event.preventDefault();
    this.anclado =  this.anclado? false : true;
    this.candado = this.anclado ? faLock : faLockOpen;

  }

}

