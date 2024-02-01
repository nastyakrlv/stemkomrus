import {Component, Input} from '@angular/core';
import {ICatalog, IItem} from "../types/catalog.interface";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
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
  @Input({transform: (value: ICatalog | IItem) => value as ICatalog}) catalog!: ICatalog;

  constructor() {
    this.url = URL;
  }
}
