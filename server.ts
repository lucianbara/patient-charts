const contract = require('@truffle/contract');
import Web3 from 'web3';
import express from 'express';
import {Doctor, Patient, HealthEvent} from "./types/api/interfaces"

const DEFAULT_ACCOUNT = "0xE806a93498d28A434a2A458fF61872981DA3F35E";

const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
const web3 = new Web3(provider);

const healthChart = contract(require("./build/contracts/HealthChart.json"))
healthChart.setProvider(provider);

const app = express();
app.use(express.json());

/*Get doctor info*/
app.get('/api/healthchart/doctor/:id', async(req,res) => {
    const instance = await healthChart.deployed();
    let doctor = [];
    let doctor_result : Doctor = {id:"", address:"", firstName:"", lastName:""};
    if(req.params.id.startsWith("0x"))
    {
        doctor = await instance.methods["getDoctor(address)"](req.params.id);
        doctor_result.id = doctor[0];
        doctor_result.address = req.params.id;
        doctor_result.firstName = doctor[1];
        doctor_result.lastName = doctor[2];
    }
    else
    {
        doctor = await instance.methods["getDoctor(uint32)"](req.params.id);
        doctor_result.id = req.params.id;
        doctor_result.address = doctor[0];
        doctor_result.firstName = doctor[1];
        doctor_result.lastName = doctor[2];
    }

    console.log(doctor);
    res.json({doctor});
});

/*{
    "username" : "user",
    "password" : "pass",
    "address"  : "hash",
    "firstname" : "F Name",
    "lastName" : "L Name",
}*/
/*Add a doctor*/
app.post('/api/healthchart/doctor', async(req, res) => {
    const instance = await healthChart.deployed();
    const result = await instance.addDoctor(
        req.body.username, 
        req.body.password, 
        req.body.address, 
        req.body.firstname, 
        req.body.lastname, 
        {from: DEFAULT_ACCOUNT});
    
    console.log(result);
    res.sendStatus(200);
});


/*Get a patient*/
app.get('/api/healthchart/patient/:ssn', async(req,res) => {
    const instance = await healthChart.deployed();
    let patient_result : Patient = { ssn : "",  firstName : "", lastName : "", currantDoctor : ""};
    let patient = await instance.getPatient(req.params.ssn);
    patient_result.ssn           = req.params.ssn;
    patient_result.firstName     = patient[0];
    patient_result.lastName      = patient[1];
    patient_result.currantDoctor = patient[2];

    console.log(patient);
    res.json({patient_result});
});

/*Add a patient*/
app.post('/api/healthchart/patient', async(req,res) => {
    const instance = await healthChart.deployed();
    const currentDoctor = req.body.doctor;
    let patient = await instance.addPatient(req.body.ssn, req.body.firstname, req.body.lastname, {from: currentDoctor}); //TODO change this to some cookie or smth
    console.log(patient);
    return res.sendStatus(200);
});

/*Change a patient to another doctor*/
app.put('/api/healthchart/patient/:ssn/move', async(req, res) => {
    const instance = await healthChart.deployed();
    const currentDoctor = req.body.doctor;
    let patient = await instance.transferPatient(req.body.id, req.params.ssn, {from: currentDoctor}); //TODO change this to some cookie or smth
    console.log(patient);
    return res.sendStatus(200);

});

/*Get events for a patient*/
app.get('/api/healtchart/patient/:ssn/events', async(req, res) => {
    const instance = await healthChart.deployed();
    let events = await instance.getEventsForPatient(req.params.ssn);
    console.log(events);
    res.json({events});
});

/*Get event details for an event*/


app.listen(3000, () => {
    console.log('Server started on port 3000');
  });