import {Component, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ICatalog, IItem, ISizes} from "../types/catalog.interface";
import {URL} from "../../constants";
import {CommonModule} from "@angular/common";
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MainService} from "../main.service";
import {catchError, Observable, ReplaySubject, takeUntil, throwError, timeout} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {LocalStorageKeys} from "../types/local-storage-keys.enum";
import {ICart, IProperties} from "../types/cart.interface";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';


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
    MatProgressSpinnerModule,
    MatSnackBarModule
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
  @ViewChild('itemPropertiesForm') itemPropertiesForm!: NgForm;

  constructor(
    private formBuilder: FormBuilder,
    private _mainService: MainService,
    private _snackBar: MatSnackBar
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

    const {name_rus, img_path} = this.item;
    const {quantity} = this.itemForm.value;
    let product: ICart = {name_rus, img_path, quantity, propertiesArray};


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

    //Очистка формы
    this.itemPropertiesForm.reset();
    this.itemForm.patchValue({quantity: 1});

    this.enabledItems = this.enabledItems.slice(0, 1);
    this.openSnackBar();
  }

  public onSizeChange(sizeName: string, selectedValue: string) {
    this._mainService.getFilteredItem(this.item.name, {[sizeName]: selectedValue}).pipe(
      //Если работает медленно
      timeout(1400),
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

      //Обработка: Если в ответ пришел лишь один доступный размер
      if (filteredItem.contain_sizes.length === 1) {
        const formValues = this.itemForm.value;
        formValues[filteredItem.size_name] = filteredItem.contain_sizes[0];
        this.itemForm.patchValue(formValues);
        if (this.item.sizes[this.item.sizes.length - 1].size_name !== filteredItem.size_name) {
          this.onSizeChange(filteredItem.size_name, filteredItem.contain_sizes[0])
        }
      }
    });
  }

  public isSizeAvailable(sizeName: string, size: string): boolean {
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

  private openSnackBar(): void {
    this._snackBar.open('Товар добавлен в коризну!', '', {
      duration: 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}

