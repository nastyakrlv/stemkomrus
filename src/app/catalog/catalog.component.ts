import {Component, Input} from '@angular/core';
import {ICatalog, IItem} from "../types/catalog.interface";
import {CommonModule, UpperCasePipe} from "@angular/common";
import {RouterLink, RoutesRecognized} from "@angular/router";
import {URL} from "../../constants";

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent {
  public url: string;
  @Input({transform: (value: ICatalog | IItem) => value as ICatalog}) catalog?: ICatalog;

  constructor() {
    this.url = URL;
  }
}
