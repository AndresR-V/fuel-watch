import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Options, LabelType } from "@angular-slider/ngx-slider";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})

export class FiltersComponent implements OnInit {

  @Input() precioMin:any = 1.5; // minimo del slider
  @Input() precioMax:any = 2.5; // máximo del slider
  @Input() listadoMarcas:string[] = [];

  @Output() combustiblesMostrar = new EventEmitter<object>();
  @Output() rangosPrecio = new EventEmitter<object>();
  @Output() marcaSeleccionada= new EventEmitter<object>();

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

  // estos datos se sacan de la media de precios actual
  // minValue: number = 1.80;
  // maxValue: number = 2.30;
  rangeTarget:string= "";

  private rangos = {
    target: this.rangeTarget,
    min:  this.precioMin,
    max: this.precioMax,
  }


  options: Options = {
    floor: this.precioMin,
    ceil: this.precioMax,
    step:0.01,
    translate: (value: number, label: LabelType): string => {
      value;
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
    // console.log('form ->'+ this.filtersForm.value)
    this.filtersForm.valueChanges.subscribe(vat =>{
      this.variable = "variable = ${val}"
  });
  }


  constructor() {
  }


  ngOnInit(): void {
    // cuando se inicia la aplicacion recoge los rangos del slider
    this.rangosPrecio.emit(this.rangos);


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

    this.rangos.target = event.target.selectedIndex;

    this.readSlider(event);
    this.rangosPrecio.emit(this.rangos);

  }

  readSelectMarca(event:any){
    console.log('event.target.value: '+event.target.value)
    this.marcaSeleccionada.emit(event);

  }

 readSlider(event:any){

    this.rangos.min= this.actualminValue;
    this.rangos.max= this.actualmaxValue;
    // console.log(this.rangos);


  }

  async submitSlider(event:any){
    this.rangosPrecio.emit(this.rangos);
  }

}

