
export interface Doctor {
    id        : string;
    address   : string;
    firstName : string;
    lastName  : string;
}

import { Request } from "express"
export interface DoctorRequest extends Request {
  user: string // or any other type
}

export interface Patient {
    ssn           : string;
    firstName     : string;
    lastName      : string;
    currantDoctor : string;
}

export interface HealthEvent {
    doctor : Doctor;
    eventDetails : string;
    date : Date;
}