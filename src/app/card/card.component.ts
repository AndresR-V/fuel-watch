import { Component, OnInit ,Input } from '@angular/core';
import { faGasPump } from '@fortawesome/free-solid-svg-icons';


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

  }

  faGasPump = faGasPump;








}
