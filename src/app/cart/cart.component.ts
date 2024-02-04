import {Component, OnInit, ViewChild} from '@angular/core';
import {ICart, IPurchases} from "../types/cart.interface";
import {LocalStorageKeys} from "../types/local-storage-keys.enum";
import {URL} from "../../constants";
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from "@angular/common";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule, NgForm,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {catchError, finalize, Observable, ReplaySubject, takeUntil, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {MainService} from "../main.service";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

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
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  public productsInBasket: ICart[];
  public url: string;
  public purchaseForm: FormGroup;
  public isLoadingSendCart: boolean;
  private _onDestroy$: ReplaySubject<void>;

  @ViewChild('purchase') purchase!: NgForm;

  constructor(
    private _mainService: MainService,
    private _snackBar: MatSnackBar
  ) {
    this._onDestroy$ = new ReplaySubject<void>(1);
    this.productsInBasket = [];
    this.url = URL;
    this.isLoadingSendCart = false;

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

  public updateQuantity(quantity: string, index: number): void {
    this.productsInBasket[index].quantity = quantity;
    localStorage.setItem(LocalStorageKeys.CART, JSON.stringify(this.productsInBasket));
  }

  public removeFromCart(index: number): void {
    this.productsInBasket.splice(index, 1);
    localStorage.setItem(LocalStorageKeys.CART, JSON.stringify(this.productsInBasket));
  }

  public sendCart(): void {
    const {name, email, phone} = this.purchaseForm.value;
    const cart: IPurchases = {name, email, phone, basket: this.productsInBasket};
    this.isLoadingSendCart = true;
    this._mainService.sendCart(cart).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      takeUntil(this._onDestroy$),
      finalize(() => this.isLoadingSendCart = false)
    ).subscribe(() => {
      this.purchase.resetForm();
      this.productsInBasket = [];
      localStorage.removeItem(LocalStorageKeys.CART);
      this.openSnackBar();
    })
  }

  private openSnackBar(): void {
    this._snackBar.open('Вы успешно совершили покупку!', '', {
      duration: 1500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  private atLeastOneRequired(control: AbstractControl): ValidationErrors | null {
    if (control.get('email')?.value || control.get('phone')?.value) {
      return null;
    }
    return {'atLeastOneRequired': true};
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    alert('Непредвиденная ошибка');
    return throwError(() => error);
  }
}
