import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const remoteURL: string = window.location.origin + '/api/';


//const remoteURL: string = 'http//:localhost:5000';

//const remoteURL: string = environment.backend.baseURL;

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable(
    {
        providedIn: 'root',
    }
)
export class RemoteService {
    constructor(public http: HttpClient) {

    }
    url: string = 'http://localhost:5000/user';;

    upload(fileToUpload: File): Observable<Object> {
        const endpoint = 'files/up';
        const formData: FormData = new FormData();
        formData.append('filetoupload', fileToUpload, fileToUpload.name);
        return this.post(endpoint, formData);
    }

    get(url: string,params:any): Observable<Object> {
        url = this.getRemoteUrl().concat(url);
        console.log('Get Request  : ', url);
        return this.http.get(url,params)
            .pipe(
                catchError(this.handleError)
            );
    }

    post(url: string, body: any): Observable<Object> {
        url = this.getRemoteUrl().concat(url);
        // console.log('Post Request  : ', url, body);

        return this.http.post(url, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // Return an observable with a user-facing error message.
        return throwError(
            'Something bad happened; please try again later.');
    }

    getHttpClient(): HttpClient {
        return this.http;
    }

    protected getRemoteUrl(): string {
        return remoteURL;
    }

    getHttpOptions(): any {
        return httpOptions;
    }

    }
