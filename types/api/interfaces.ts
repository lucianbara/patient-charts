
export interface Doctor {
    id        : string;
    address   : string;
    firstName : string;
    lastName  : string;
}

export interface Patient {
    ssn           : string;
    firstName     : string;
    lastName      : string;
    currantDoctor : string;
}

export interface HealthEvent {
    doctorAddress : string;
    eventDetails : string;
}