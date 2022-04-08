// import { SLOT_CONSTANTS } from "../common/calendar/calendar.entity";
// import * as geoTz from "geo-tz";

export const USER_ACTIVITY:any = {
  REGISTERED: "registered",
  LOGGED_IN: "logged_in",
  LOGGED_OUT: "logged_out",
};



export interface Role {
  id: string;
  label: string;
}

export const ROLES:any = {
  ORGANISER: { id: "ORGANISER", label: "Organiser" },
  ADMIN: { id: "ADMIN", label: "Admin" },
};

export const VERIFICATION_MODES = {
  MANUAL: { id: "manual", label: "Manual" },
  EMAIL_DOMAIN_MATCH: {
    id: "email-domain-match",
    label: "Match to Referrer Email Domain",
  },
};

export const DEFAULT_ROLE: Role = ROLES.ADMIN;

export const getRoles = () => {
  return Object.keys(ROLES).map((id) => {
    return ROLES[id];
  });
};

export class User {
  id!: string;
  email!: string;
  password!: string;
  role!: string;
}

export class UserProfile extends User {
  firstName!: string;
  lastName!: string;
  phoneNumber!: string;
  address!: string;
  getFullName = () => {
    return `${this.firstName ? this.firstName : ""} ${this.lastName ? this.lastName : ""
      }`;
  };

  //  toString() {
  //   if (this.firstName || this.lastName) {
  //     return this.getFullName();
  //   } else {
  //     return this.email;
  //   }
  // }

 
}


export class OrganiserProfile extends UserProfile {
  dateOfBirth!: Date;
  batch!:string;
  dateOfJoining!: Date;
  experience!: number;
}


export class ActvityLog {
  userID!: string;
  clientIP!: string;
  activity!: string;
  createTime!: number; // time in milliseconds
  data: any;
}


