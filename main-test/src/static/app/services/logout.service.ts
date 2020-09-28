import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError as observableThrowError, Observable, forkJoin} from 'rxjs';

@Injectable()
export class LogoutService {

  localStorageKey = 'visitedAppList';
  myAppList: string[] = [];
  context: string;

  constructor(private http: HttpClient) {
    this.context = window.location.pathname.substring(1, window.location.pathname.indexOf('/', 2));
    const appList: string[] = this.getFromSessionStorage(this.localStorageKey);
    this.myAppList = appList ? appList.filter(f => f !== this.context).concat([this.context]) : [this.context];
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.myAppList));
  }


  private killItServiceCall(app: string): Observable<any> {
    const url = '/' + app + '/service/killit';
    return this.http
        .delete(url, { responseType: 'text' })
        .pipe(
            map((response) => {
                return response;
            }),
            catchError((error) => {
                return observableThrowError(error.error);
            })
        );
}


logoutMe(redirectLoginPage: boolean = true) {
  let observerList$: Observable<any>[] = [];

  this.myAppList.forEach(app => {
    if (app !== this.context) {
      observerList$.push(this.killItServiceCall(app));
    }
  });

  if (observerList$ && observerList$.length > 0) {
    forkJoin(observerList$).subscribe(
      response => {
        this.redirectToLogout(redirectLoginPage);
      },
      error => {
        this.redirectToLogout(redirectLoginPage);
      });
  } else {
    this.redirectToLogout(redirectLoginPage);
  }

}

  private getFromSessionStorage(key: string) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.error('Error getting data from sessionStorage', e);
      return null;
    }
  }

  redirectToLogout(redirectLoginPage: boolean) {
    if (redirectLoginPage) {
      window.open('logout', '_self');
    }
    localStorage.setItem(this.localStorageKey, JSON.stringify([]));
  }

}
