import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ICatalog, IItem, ISizes} from "../types/catalog.interface";
import {URL} from "../../constants";
import {CommonModule} from "@angular/common";
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MainService} from "../main.service";
import {catchError, Observable, ReplaySubject, takeUntil, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {LocalStorageKeys} from "../types/local-storage-keys.enum";


@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit, OnDestroy {
  public url: string;
  public itemForm!: FormGroup;
  public filtredItems: ISizes[];
  private _onDestroy$: ReplaySubject<void>;


  @Input({transform: (value: ICatalog | IItem) => value as IItem}) item!: IItem;

  constructor(
    private formBuilder: FormBuilder,
    private _mainService: MainService
  ) {
    this.url = URL;
    this.filtredItems = [];
    this._onDestroy$ = new ReplaySubject<void>(1);
  }

  ngOnInit(): void {
    const formControls: { [key: string]: FormControl } = {};
    this.item.sizes.forEach((size: ISizes) => {
      formControls[size.size_name] = new FormControl('', Validators.required);
    });
    formControls['quantity'] = new FormControl('1', Validators.required);
    this.itemForm = this.formBuilder.group(formControls);

    this.filtredItems.push(this.item.sizes[0])
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }

  public onAddToCart(): void {
    let product = this.itemForm.value;
    product.name = this.item.name_rus;
    let existingCart: string | null = localStorage.getItem(LocalStorageKeys.CART);
    let cart = existingCart ? JSON.parse(existingCart) : [];
    cart.push(product);
    localStorage.setItem(LocalStorageKeys.CART, JSON.stringify(cart));
  }

  public onSizeChange(sizeName: string, selectedValue: string) {
    this._mainService.getFilteredItem(this.item.name, {[sizeName]: selectedValue}).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      takeUntil(this._onDestroy$)
    ).subscribe((filteredItem: ISizes) => {
      const existingIndex: number = this.filtredItems.findIndex(item => item.size_name === sizeName);
      if (existingIndex !== -1) {
        this.filtredItems = this.filtredItems.slice(0, existingIndex + 1);
        const formValues = this.itemForm.value;
        Object.keys(formValues).slice(existingIndex + 1, -1).forEach(key => {
          formValues[key] = '';
        });

        this.itemForm.patchValue(formValues);
      }
      this.filtredItems.push(filteredItem);
    });
  }

  isSizeAvailable(sizeName: string, size: string): boolean {
    return this.filtredItems.some(item =>
      item.size_name === sizeName && item.contain_sizes.includes(size)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    alert('Непредвиденная ошибка');
    return throwError(() => error);
  }
}
