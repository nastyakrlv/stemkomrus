import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ICatalog, IItem, ISizes} from "../types/catalog.interface";
import {URL} from "../../constants";
import {CommonModule} from "@angular/common";
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MainService} from "../main.service";
import {catchError, finalize, Observable, ReplaySubject, takeUntil, throwError, timeout} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {LocalStorageKeys} from "../types/local-storage-keys.enum";
import {ICart, IProperties} from "../types/cart.interface";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit, OnDestroy {
  public url: string;
  public isLoadingFilter: boolean;
  public itemForm!: FormGroup;
  public enabledItems: ISizes[];
  private _onDestroy$: ReplaySubject<void>;


  @Input({transform: (value: ICatalog | IItem) => value as IItem}) item!: IItem;

  constructor(
    private formBuilder: FormBuilder,
    private _mainService: MainService
  ) {
    this.url = URL;
    this.enabledItems = [];
    this._onDestroy$ = new ReplaySubject<void>(1);
    this.isLoadingFilter = false;
  }

  ngOnInit(): void {
    const formControls: { [key: string]: FormControl } = {};
    this.item.sizes.forEach((size: ISizes) => {
      formControls[size.size_name] = new FormControl('', Validators.required);
    });
    formControls['quantity'] = new FormControl('1', Validators.required);
    this.itemForm = this.formBuilder.group(formControls);

    this.enabledItems.push(this.item.sizes[0])
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }

  public onAddToCart(): void {
    //Создание массива свойств товаров
    let propertiesArray: IProperties[] = Object.entries(this.itemForm.value)
      .filter(([key]) => key !== 'quantity')
      .map(([key, value]) => {
        return {size_name: key, size: value as string};
      });

    let product: ICart = {
      name_rus: this.item.name_rus,
      img_path: this.item.img_path,
      quantity: this.itemForm.value.quantity,
      propertiesArray: propertiesArray
    };

    let existingCart: string | null = localStorage.getItem(LocalStorageKeys.CART);
    let cart: ICart[] = existingCart ? JSON.parse(existingCart) : [];

    //Проверка на наличие похожего товара в корзине
    let existingProductIndex: number = -1;
    cart.forEach((item, index) => {
      if (item.name_rus === product.name_rus && JSON.stringify(item.propertiesArray) === JSON.stringify(product.propertiesArray)) {
        existingProductIndex = index;
      }
    });

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity = (parseInt(cart[existingProductIndex].quantity, 10) + parseInt(product.quantity, 10)).toString();
    } else {
      cart.push(product);
    }

    localStorage.setItem(LocalStorageKeys.CART, JSON.stringify(cart));
  }

  public onSizeChange(sizeName: string, selectedValue: string) {
    this._mainService.getFilteredItem(this.item.name, {[sizeName]: selectedValue}).pipe(
      //Если бэк работает медленно
      timeout(1000),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      takeUntil(this._onDestroy$)
    ).subscribe((filteredItem: ISizes) => {
      //Обработка: Если пользователь выбирает фильтр не по порядку
      const existingIndex: number = this.enabledItems.findIndex(item => item.size_name === sizeName);
      if (existingIndex !== -1) {
        //Очистка массива доступных для выбора свойств
        this.enabledItems = this.enabledItems.slice(0, existingIndex + 1);

        //Очистка формы
        const formValues = this.itemForm.value;
        Object.keys(formValues).slice(existingIndex + 1, -1).forEach(key => {
          formValues[key] = '';
        });
        this.itemForm.patchValue(formValues);
      }
      this.enabledItems.push(filteredItem);
    });
  }

  isSizeAvailable(sizeName: string, size: string): boolean {
    if (this.isLoadingFilter) {
      return false;
    } else {
      return this.enabledItems.some(item =>
        item.size_name === sizeName && item.contain_sizes.includes(size)
      );
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.isLoadingFilter = true;
    alert('Непредвиденная ошибка. Обновите страницу.');
    return throwError(() => error);
  }
}
