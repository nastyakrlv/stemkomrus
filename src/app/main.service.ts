import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {IFeedback} from "./types/feedback.interface";
import {catchError, Observable, throwError} from "rxjs";
import {API_URL} from "../constants";
import {IMessage} from "./types/message.interface";


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
}
