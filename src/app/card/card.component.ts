import { Component, OnInit } from '@angular/core';
import { faGasPump } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  faGasPump = faGasPump;
}
