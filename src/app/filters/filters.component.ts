import { Component, OnInit } from '@angular/core';
import { Options, LabelType } from "@angular-slider/ngx-slider";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})

export class FiltersComponent implements OnInit {

  @Output() combustiblesMostrar = new EventEmitter<object>();
  @Output() rangosPrecio = new EventEmitter<object>();

  public combustibles = [
    {
      code: 1,
      name: "Diesel",
      active: true
    },
    {
      code: 2,
      name: "Diesel+",
      active: true
    },
    {
      code: 3,
      name: "Gasolina 95",
      active: true
    },
    {
      code: 4,
      name: "Gasolina 98",
      active: true
    }
  ];


  private  showCombustibles = {
    diesel:true,
    dieselPlus:true,
    gasolina95:true,
    gasolina98:true
  };

  private combustibleSeleccionado:number=0;

  public variable: string="";


  filtersForm: FormGroup  = new FormGroup({
    dieselEnable    : new FormControl(true),
    dieselPlusEnable: new FormControl(true),
    gas95Enable     : new FormControl(true),
    gas98Enable     : new FormControl(true),

    slideTarget     : new FormControl(null,[ Validators.required ]),
    minPrice        : new FormControl(1.50),
    maxPrice        : new FormControl(2.50),
    sliderControl   : new FormControl([20, 80])


  });

  // Slider doble
  actualminValue: number=0;
  actualmaxValue: number=0;

  minValue: number = 1.85;
  maxValue: number = 2.10;

  private rangos =[
    [this.minValue, this.maxValue],
    [this.minValue, this.maxValue],
    [this.minValue, this.maxValue],
    [this.minValue, this.maxValue]
  ]


  options: Options = {
    floor: 1.70,
    ceil: 2.30,
    step:0.01,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          this.actualminValue = value;
          return "<b>Precio min:</b> €" + value;
        case LabelType.High:
          this.actualmaxValue = value;
          return "<b>Precio max:</b> €" + value;
        default:
          return "  €" + value;
      }
    }
  };



  capturaFiltro():void{
    console.log('form ->'+ this.filtersForm.value)
    this.filtersForm.valueChanges.subscribe(vat =>{
      this.variable = "variable = ${val}"
  });
  }


  constructor() {



  }


  ngOnInit(): void {

  }



  readCheck(event:any){
    event.preventDefault();


    switch(event.target.id){
      case 'dieselEnable':
        this.showCombustibles.diesel = event.target.checked;
        this.combustibles[0].active = event.target.checked;
        break;
      case 'dieselPlusEnable':
        this.showCombustibles.dieselPlus = event.target.checked;
        this.combustibles[1].active = event.target.checked;
        break;
      case 'gas95Enable':
        this.showCombustibles.gasolina95 = event.target.checked;
        this.combustibles[2].active = event.target.checked;
        break
      case 'gas98Enable':
        this.showCombustibles.gasolina98 = event.target.checked;
        this.combustibles[3].active = event.target.checked;
        break
    }

    this.combustiblesMostrar.emit(this.showCombustibles);
  }

  readSelect(event:any){

    this.combustibleSeleccionado = event.target.selectedIndex;
    console.log("combustibleSeleccionado= "+this.combustibleSeleccionado);
    this.rangos =[
      [this.minValue, this.maxValue],
      [this.minValue, this.maxValue],
      [this.minValue, this.maxValue],
      [this.minValue, this.maxValue]]
  }

  readSlider(event:any){

    this.rangos[this.combustibleSeleccionado] = [this.actualminValue , this.actualmaxValue];

    console.log(this.rangos);
    this.rangosPrecio.emit(this.rangos);
  }


}

