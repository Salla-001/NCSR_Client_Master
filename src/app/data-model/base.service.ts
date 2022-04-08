import { Injectable } from '@angular/core';
import { Subscriber } from 'rxjs';
import { RemoteService } from './remote.service';

export interface QueryResult {
    status: string;
    data: any;
}

@Injectable()
export abstract class BaseRemoteService {

    STATUS = {
        PASS: 'pass',
        FAIL: 'fail',
    };

    constructor(protected remote: RemoteService) {
    }

    isPass = (result: QueryResult) => {
        if (result && result.status === this.STATUS.PASS) {
            return true;
        } else {
            return false;
        }
    }

    notifySubscriber(
        subscriber: Subscriber<any>,
        data: any = { msg: 'Error!!!' },
        status: string = this.STATUS.FAIL) {
        const outcome: QueryResult = { status: status, data: data };
        // console.log('Notify Subscribers: ', outcome);
        subscriber.next(outcome);
    }

    getPublicIP(callback: Function) {
        this.remote.http.get(`https://api.ipify.org/?format=json`).subscribe(
            (result: any) => {
                let pIP!: string;
                if (result) {
                    pIP = result['ip'];
                }
                if (callback) {
                    callback(pIP);
                }
            }
        );

    }

}
