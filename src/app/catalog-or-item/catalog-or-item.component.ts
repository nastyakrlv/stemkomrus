import {Component, OnDestroy, OnInit} from '@angular/core';
import {MainService} from "../main.service";
import {catchError, Observable, ReplaySubject, takeUntil, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {ICatalog, IItem} from "../types/catalog.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {CatalogComponent} from "../catalog/catalog.component";
import {ItemComponent} from "../item/item.component";

@Component({
  selector: 'app-catalog-or-item',
  standalone: true,
  imports: [CatalogComponent, ItemComponent],
  templateUrl: './catalog-or-item.component.html',
  styleUrl: './catalog-or-item.component.scss'
})
export class CatalogOrItemComponent implements OnDestroy, OnInit {
  private _onDestroy$: ReplaySubject<void>;
  public catalogOrItem: ICatalog | IItem;
  public param?: string | null;
  public type: string;

  constructor(
    private _mainService: MainService,
    private _route: ActivatedRoute,
    private router: Router
  ) {
    this._onDestroy$ = new ReplaySubject<void>(1);
    this.catalogOrItem = {} as ICatalog;
    this.type = "";
  }

  ngOnInit(): void {
    this.param = this._route.snapshot.paramMap.get('subcatalog');
    this.getCatalogOrItem(this.param)
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }

  public getCatalogOrItem(path: string | null): void {
    this._mainService.getCatalogOrItem(path).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      takeUntil(this._onDestroy$)
    ).subscribe((response: ICatalog | IItem) => {
      this.type = response.type;
      if (this.type === 'catalog') {
        this.catalogOrItem = response as ICatalog;
      } else if (this.type === 'item') {
        this.catalogOrItem = response as IItem;
      }
    })
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 404) {
      this.router.navigate(['/page-not-found']);
    } else {
      alert('Непредвиденная ошибка');
    }
    return throwError(() => error);
  }
}
