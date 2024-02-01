import {AfterViewInit, Component, ElementRef} from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent implements AfterViewInit{

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
    this.el.nativeElement.scrollIntoView();
  }
}
