import {AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {IBenefits} from "../types/benefits.interface";
import {ICooperation} from "../types/cooperation.interface";
import {MatInputModule} from '@angular/material/input';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  public benefits: IBenefits[];
  public cooperation: ICooperation[];
  public feedback: FormGroup;

  constructor() {
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
      phone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      text: new FormControl('', Validators.required)
    })
  }

  public sendFeedback(): void {
    console.log(this.feedback.value)
  }
}
