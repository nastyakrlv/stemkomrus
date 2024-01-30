import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {IFeedback} from "./types/feedback.interface";
import {catchError, Observable, throwError} from "rxjs";
import {API_URL} from "../constants";
import {IMessage} from "./types/message.interface";
import {ICatalog, ISizes} from "./types/catalog.interface";
import {IFilterParams} from "./types/filter-params.interface";

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private _http: HttpClient) { }

  public sendFeedback(information: IFeedback): Observable<IMessage> {
    return this._http.post<IMessage>(API_URL + 'email_question', information).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => error))
    )
  }

  public getCatalogOrItem(path: string | null): Observable<ICatalog> {
    const apiUrl: string | null = path ? `${API_URL}catalog/${path}` : `${API_URL}catalog`;
    return this._http.get<ICatalog>(apiUrl).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => error))
    )
  }

  public getFilteredItem(path: string | null, filters: IFilterParams): Observable<ISizes> {
    let params = new HttpParams();

    for (const key in filters) {
      if (filters.hasOwnProperty(key) && filters[key]) {
        params = params.set(key, filters[key]!);
      }
    }

    return this._http.get<ISizes>(`${API_URL}catalog/${path}/?`, {params}).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => error))
    )
  }
}
