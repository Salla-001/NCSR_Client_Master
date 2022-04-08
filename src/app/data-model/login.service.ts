import { Injectable } from "@angular/core";
import { catchError, Observable, Subscriber, throwError } from "rxjs";
import { RemoteService } from "./remote.service";
import { HttpClient,HttpParams, HttpHeaders } from '@angular/common/http';
import { traineeProfile } from "./trainee.entity";

@Injectable({
    providedIn: 'root',
  })
  export class loginService{
    private url = 'http://localhost:5000/admin';

  
    constructor(private remoteService: RemoteService,  private httpClient: HttpClient) {
    }
  
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
saveAdmin(admin:any):Observable<any>{
    return this.httpClient.post(this.url+'/saveAdmin',JSON.stringify(admin), this.httpOptions)
}    
loginAdmin(admin:any):Observable<any>{
    return this.httpClient.get(this.url+'/login');

}

  } 