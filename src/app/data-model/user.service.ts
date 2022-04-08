import { catchError, Observable, Subscriber, throwError } from "rxjs";
import { RemoteService } from "./remote.service";
import { HttpClient,HttpParams, HttpHeaders } from '@angular/common/http';
import { traineeProfile } from "./trainee.entity";

import { Injectable } from '@angular/core';
import * as ASYNC from 'async';
import { APP_DATA } from './app.data';
import { BaseRemoteService, QueryResult } from './base.service';
import {
    ActvityLog, 
    DEFAULT_ROLE, 
    User, UserProfile,
    USER_ACTIVITY, VERIFICATION_MODES,
} from './user.entity';
@Injectable({
    providedIn: 'root',
})
export class UserService extends BaseRemoteService {
    serviceName = 'user';    
  
    registeruser(user: User, profile: UserProfile, role: string = DEFAULT_ROLE.id): Observable<any> {
    return new Observable<any>(
        subscriber => {
            this.remote.http.post(this.remote.url+'/register', user).subscribe(
                (result: any) => {
                    console.log(result,"check1")
                    if (result.status === this.STATUS.PASS) {
                        const userID = result.data.id;
                        profile.id = userID;
                        profile.email = user.email;
                        profile.role = role;
                        console.log(profile,"profile")
                        this.createProfile(profile, (res: any) => {
                            if (this.isPass(res)) {
                                // user role
                                console.log('creating user in role, ', profile);
                                this.saveRole(profile).subscribe(
                                    (sRoleResult: any) => {

                                        console.log(sRoleResult)
                                        // this.notifySubscriber(subscriber, profile, this.STATUS.PASS);
                                        // this.logActivity(USER_ACTIVITY.REGISTERED, profile.id);
                                    }
                                );
                            } else {
                                this.notifySubscriber(subscriber,
                                    `Failed to create profile of ${profile.toString()}`,
                                    this.STATUS.FAIL);
                            }
                        });

                    } else {
                        this.notifySubscriber(subscriber, result.data, this.STATUS.FAIL);
                    }
                }
            );
        }
    );
}

private createProfile(profile: UserProfile, clbk?: Function) {

            this.saveProfile(profile).subscribe(
                (profileRes:any) => {
                    if (this.isPass(profileRes)) {
                        console.log('Profile created.');
                    } else {
                        alert('Problem updating profile. Try again.');
                    }
                    if (clbk) {
                        clbk(profileRes);
                    }
                }
            );
        
    
}
doLogin(user: User): Observable<any> {
    return new Observable<any>(
        subscriber => {
            this.login(user).subscribe(
                (result:any) => {
                    console.log('User Login Result: ', result);
                    if (result.status === this.STATUS.PASS
                        && result.data && result.data.length === 1) {
                        const uid = result.data[0]['user_id'];
                        this.loadProfileAndSetActive(uid, subscriber);
                    } else {
                        this.notifySubscriber(subscriber, undefined, this.STATUS.FAIL);
                    }
                }
            );
        }
    );
}

private loadProfileAndSetActive(uid: any, subscriber:any) {
    let activeUser: UserProfile = new UserProfile();
    activeUser.id = uid;
    // activeUser.email = user.email;

    ASYNC.waterfall(
        [
            (callback: Function) => {
                activeUser.role = DEFAULT_ROLE.id;
                this.getRoles(activeUser).subscribe(
                    (roles) => {
                        if (roles.status === this.STATUS.PASS
                            && roles.data && roles.data.length >= 1) {
                            const role = roles.data[0];
                            if (role.role_id) {
                                activeUser.role = role.role_id;
                            }
                        }
                        console.log('role loaded.');
                        callback(undefined, activeUser);
                    }
                );
            },
            (profile: UserProfile, callback: Function) => {
                // set active user (profile)
                this.getProfiles(activeUser).subscribe(
                    (profiles:any) => {
                        if (profiles.status === this.STATUS.PASS
                            && profiles.data.length > 0) {
                            activeUser = Object.assign(activeUser, profiles.data[0]);
                        }
                        console.log('Profile loaded.');
                        callback(undefined, activeUser);
                    }
                );
            },
        ],
        (err: any) => {
            console.log('Do Login DONE - ', err, activeUser);
            if (err) {
                this.notifySubscriber(subscriber, err, this.STATUS.FAIL);
            } else {
                APP_DATA.activeUser = activeUser;
                this.logActivity(USER_ACTIVITY.LOGGED_IN);
                this.notifySubscriber(subscriber, APP_DATA.activeUser, this.STATUS.PASS);
            }
        }
    );
}
logActivity(activity: string, userID?: string, data?: any) {

    const log: ActvityLog = new ActvityLog();   
    log.userID = (userID) ? userID : APP_DATA.activeUser.id;
    console.log(log.userID);
    if (!log.userID) {
        return;
    }
    log.activity = activity;
    log.data = JSON.stringify(data);
    console.log('Create Audit Log : ', log);

    this.remote.post(`${this.serviceName}/auditLog/create`, log).subscribe(
        (result: any) => {
            if (result.status === this.STATUS.PASS) {
                console.log('Logged activity - ', log);
            }
        }
    );
}

private buildUserProfile(data: any) {
    const user = new UserProfile();
    user.id = data.user_id;
    user.email = data.email;
    user.firstName = data.first_name;
    user.lastName = data.last_name;
    user.phoneNumber = data.phone_number;
    user.address = data.address;
    user.role = data.role_id;
    return user;
}

getProfiles(userCondition: UserProfile | { id?: Array<string>, email?: string }): Observable<any> {
    return new Observable<any>(
        subscriber => {
            this.remote.post(`${this.serviceName}/getProfiles`, userCondition)
                .subscribe(
                    (result: any) => {
                        if (result.status === this.STATUS.PASS && result.data) {
                            const userList: Array<UserProfile> = result.data.map(
                                (data: any) => {
                                    const user = this.buildUserProfile(data);
                                    // (data.time_zone) ? data.time_zone : SLOT_CONSTANTS.DEFAULT_TIME_ZONE;
                                    return user;
                                }
                            );
                            // console.log('Loaded user profiles - ', userList);
                            this.notifySubscriber(subscriber, userList, this.STATUS.PASS);
                        } else {
                            this.notifySubscriber(subscriber, result.data, result.status);
                        }
                    }
                );
        }
    );
}

saveRole(role: User): Observable<any> {
    return this.remote.http.post(this.remote.url+'/saveRole', role);
}

saveProfile(profile: UserProfile): Observable<any> {
    return this.remote.http.post(this.remote.url+'/saveProfile', profile);
}

getRoles(user: User): Observable<any> {
    return this.remote.post(`${this.serviceName}/getRoles`, user);
}

login(user: User): Observable<any> {
    return this.remote.post(`${this.serviceName}/login`, user);
}


}
