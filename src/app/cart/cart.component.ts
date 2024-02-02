import {Component, OnInit} from '@angular/core';
import {ICart} from "../types/cart.interface";
import {LocalStorageKeys} from "../types/local-storage-keys.enum";
import {URL} from "../../constants";
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from "@angular/common";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";



@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  public productsInBasket: ICart[];
  public url: string;
  public purchaseForm: FormGroup;

  constructor() {
    this.productsInBasket = [];
    this.url = URL;

    this.purchaseForm = new FormGroup({
      name: new FormControl('', Validators.required),
      phone: new FormControl(''),
      email: new FormControl('', Validators.email),
    }, {validators: this.atLeastOneRequired});
  }

  ngOnInit(): void {
    let existingCart: string | null = localStorage.getItem(LocalStorageKeys.CART);
    this.productsInBasket = existingCart ? JSON.parse(existingCart) : [];
  }

  public removeFromCart(index:number) {
    this.productsInBasket.splice(index, 1);
    localStorage.setItem(LocalStorageKeys.CART, JSON.stringify(this.productsInBasket));
  }

  private atLeastOneRequired(control: AbstractControl): ValidationErrors | null {
    if (control.get('email')?.value || control.get('phone')?.value) {
      return null;
    }
    return {'atLeastOneRequired': true};
  }


}
