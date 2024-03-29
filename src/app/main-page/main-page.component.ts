import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {IBenefits} from "../types/benefits.interface";
import {ICooperation} from "../types/cooperation.interface";
import {MatInputModule} from '@angular/material/input';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  NgForm,
  AbstractControl,
  ValidationErrors, FormsModule
} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MainService} from "../main.service";
import {catchError, finalize, Observable, ReplaySubject, takeUntil, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {MatFormFieldModule} from '@angular/material/form-field';
import {ICatalog} from "../types/catalog.interface";
import {URL} from "../../constants";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';


@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    CommonModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnDestroy, OnInit {
  public benefits: IBenefits[];
  public cooperation: ICooperation[];
  public catalog: ICatalog;
  public feedback: FormGroup;
  public url: string;
  public isLoadingCatalog: boolean;
  public isLoadingFeedback: boolean;
  private _onDestroy$: ReplaySubject<void>;

  @ViewChild('feedbackForm') feedbackForm!: NgForm;

  constructor(
    private _mainService: MainService,
    private _snackBar: MatSnackBar
  ) {
    this._onDestroy$ = new ReplaySubject<void>(1);

    this.url = URL;
    this.isLoadingCatalog = true;
    this.isLoadingFeedback = false;

    this.catalog = {
      img_path: '',
      name: '',
      name_rus: '',
      type: '',
      contains: []
    };

    this.benefits = [
      {
        img: "assets/clock.svg",
        description: "Гарантия качества с 2016 года"
      },
      {
        img: "assets/coin.svg",
        description: "Гибкая ценовая политика, ориентированная на потребности клиента"
      },
      {
        img: "assets/user.svg",
        description: "Индивидуальный подход к каждому клиенту и задаче"
      },
      {
        img: "assets/headphones.svg",
        description: "Быстрая обратная связь при любых вопросах и проблемах"
      }
    ]

    this.cooperation = [
      {
        img: "assets/product-selection.svg",
        title: "1 ВЫБОР ТОВАРА",
        description: "Перейдите в каталог и выберите желаемые товары"
      },
      {
        img: "assets/add-to-cart.svg",
        title: "2 ФОРМИРОВАНИЕ КОРЗИНЫ",
        description: "Добавьте выбранные товары в корзину, уточнив необходимое количество"
      },
      {
        img: "assets/order.svg",
        title: "3 ОФОРМЛЕНИЕ ЗАКАЗА",
        description: "Заполните необходимую информацию для доставки и отправьте нашему администратору"
      },
      {
        img: "assets/phone.svg",
        title: "4 ОЖИДАНИЕ ОТВЕТА",
        description: "Дождитесь ответа от нашего отдела обработки заказов"
      },
    ]

    this.feedback = new FormGroup({
      name: new FormControl('', Validators.required),
      phone: new FormControl(''),
      email: new FormControl('', Validators.email),
      text: new FormControl('', Validators.required)
    }, {validators: this.atLeastOneRequired});
  }

  ngOnInit(): void {
    this.getCatalogOrItem('')
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }

  public sendFeedback(): void {
    this.isLoadingFeedback = true;
    this._mainService.sendFeedback(this.feedback.value).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      takeUntil(this._onDestroy$),
      finalize(() => this.isLoadingFeedback = false)
    ).subscribe(() => {
      this.feedbackForm.resetForm();
      this.openSnackBar();
    })
  }

  public getCatalogOrItem(path: string | null): void {
    this._mainService.getCatalogOrItem(path).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      finalize(() => this.isLoadingCatalog = false),
      takeUntil(this._onDestroy$)
    ).subscribe((response: ICatalog) => {
      this.catalog = response;
      this.catalog.contains = this.catalog.contains.slice(0, 3);
      this.catalog.contains.push({
        img_path: "",
        name: "",
        name_rus: "Все категории \u2192"
      })
    })
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    alert('Непредвиденная ошибка');
    return throwError(() => error);
  }

  private openSnackBar(): void {
    this._snackBar.open('Спасибо за обратную связь!', '', {
      duration: 1000,
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

}
