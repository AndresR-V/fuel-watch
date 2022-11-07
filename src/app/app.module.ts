import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { HeaderComponent } from './header/header.component';
import { CardComponent } from './card/card.component';

import { CarburantesService } from "./services/carburantes.service";
import { HttpClientModule } from "@angular/common/http";
import { SearchBarComponent } from './search-bar/search-bar.component';
import { FiltersComponent } from './filters/filters.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxSliderModule } from '@angular-slider/ngx-slider';

// import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CardComponent,
    SearchBarComponent,
    FiltersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSliderModule

  ],
  providers: [CarburantesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
