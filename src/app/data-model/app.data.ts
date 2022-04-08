import { ROLES, UserProfile, USER_ACTIVITY } from './user.entity';

class AppData {
    ONETIME_LOGIN_PATH = '/onetime-login/';
    TIME_TO_START_SESSION = 15; // 15 minutes.
    private _STORAGE = sessionStorage;
    private _USER_PROFILE = 'user_profile';
    private _activeUser!: UserProfile;

    set activeUser(user: UserProfile) {
        this._activeUser = user;
        if (this._activeUser) {
            this._STORAGE.setItem(this._USER_PROFILE, JSON.stringify(this._activeUser));
        } else {
            this._STORAGE.removeItem(this._USER_PROFILE);
        }
    }

    get activeUser() {
        if (!this._activeUser) {
            const storedUserProfile = this._STORAGE.getItem(this._USER_PROFILE);
            if (storedUserProfile) {
                this._activeUser = Object.assign(new UserProfile(), JSON.parse(storedUserProfile));
            }
        }
        return this._activeUser;
    }

    isActiveUserInRole(role: string) {
        if (this.activeUser && this.activeUser.role === role) {
            return true;
        }
        return false;
    }

    isAdminLoggedIn(): boolean {
        return this.isActiveUserInRole(ROLES.ADMIN.id);
    }

    isCustomerLoggedIn(): boolean {
        return this.isActiveUserInRole(ROLES.CUSTOMER.id);
    }

    isFacilitatorLoggedIn(): boolean {
        return this.isActiveUserInRole(ROLES.FACILITATOR.id);
    }

    isPartnerLoggedIn(): boolean {
        return this.isActiveUserInRole(ROLES.PARTNER.id);
    }

    isSelfOrAdmin(uid: string) {
        if (this.isAdminLoggedIn() || this.isSelfLoggedIn(uid)) {
            return true;
        }
        return false;
    }

    isSelfLoggedIn(uid: string) {
        if (this.activeUser && this.activeUser.id === uid) {
            return true;
        }
        return false;
    }

    getRequestOrigin = () => {
        return window.location.origin;
    }

    

    registerUserActivity(activity: string) {
        USER_ACTIVITY[activity] = activity;
    }

    getUserActivities(): Array<string> {
        return Object.values(USER_ACTIVITY);
    }

}

const APP_DATA = new AppData();
export { APP_DATA };

