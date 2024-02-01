import {Component, OnInit} from '@angular/core';
import {ICart} from "../types/cart.interface";
import {LocalStorageKeys} from "../types/local-storage-keys.enum";
import {URL} from "../../constants";
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from "@angular/common";


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  public productsInBasket: ICart[];
  public url: string

  constructor() {
    this.productsInBasket = [];
    this.url = URL;
  }

  ngOnInit(): void {
    let existingCart: string | null = localStorage.getItem(LocalStorageKeys.CART);
    this.productsInBasket = existingCart ? JSON.parse(existingCart) : [];
  }
}
