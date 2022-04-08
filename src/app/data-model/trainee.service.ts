import { Injectable } from "@angular/core";
import { catchError, Observable, Subscriber, throwError } from "rxjs";
import { RemoteService } from "./remote.service";
import { HttpClient,HttpParams, HttpHeaders } from '@angular/common/http';
import { traineeProfile } from "./trainee.entity";


@Injectable({
  providedIn: 'root',
})


export class traineeService {
  private url = 'http://localhost:5000/trainee';

  
  constructor(private remoteService: RemoteService,  private httpClient: HttpClient) {
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getDuplicateProfile(email:string): Observable<any>{  
       return this.httpClient.get(this.url+'/findDuplicates',{ params: { email } });
  }  

  getAllTraineeProfiles() {
    return this.httpClient.get(this.url + '/getAllProfiles');
  }
  
  registerTrainee(trnProfile: traineeProfile): Observable<any> {
    return this.httpClient.post(this.url + '/saveProfile', JSON.stringify(trnProfile), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  // registerTrainee(trnProfile: traineeProfile): Observable<any> {
  //   return new Observable<any>{

  //   } 
  //    const hr = this.remoteService.post(this.url,trnProfile).subscribe((res)=>{

  //   })
  //   return  hr
    
  // }


  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

}





