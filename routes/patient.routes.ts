import express from 'express'
import { healthChart, DEFAULT_ACCOUNT } from '../server'
import { Patient } from '../types/api/interfaces'
import { Request, Response } from 'express'

const router = express.Router()

/*Get doctor info*/
/*Get a patient*/
router.get('/:ssn', async (req : Request, res : Response) => {
    try {
        const instance = await healthChart.deployed();
        const patient = await instance.getPatient(req.params.ssn);
        
        const patient_result: Patient = { 
            ssn: req.params.ssn, 
            firstName: patient[0], 
            lastName: patient[1], 
            currantDoctor: patient[2]
        };
        console.log(patient);
        return res.json(patient_result);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

/*Add a patient*/
router.post('/', async (req : Request, res : Response) => {
    try {
        const instance = await healthChart.deployed();
        const currentDoctor = req.body.doctor;
        const patient = await instance.addPatient(req.body.ssn, req.body.firstname, req.body.lastname, { from: currentDoctor }); //TODO change this to some cookie or smth
        res.sendStatus(200);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

/*Change a patient to another doctor*/
router.put('/:ssn/move', async (req : Request, res : Response) => {
    try {
        const instance = await healthChart.deployed();
        const currentDoctor = req.body.doctor;
        const patient = await instance.transferPatient(req.body.id, req.params.ssn, { from: currentDoctor }); //TODO change this to some cookie or smth
        console.log(patient);
        return res.sendStatus(200);
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }

});

/*Get events for a patient*/
router.get('/:ssn/events', async (req : Request, res : Response) => {
    try {
        const instance = await healthChart.deployed();
        const events = await instance.getEventsForPatient(req.params.ssn);
        console.log(events);
        return res.json(events);
    }
    catch(e) {
        console.log(e);
        return res.sendStatus(500);
    }
});

router.get('/:ssn/event-details', async (req:Request, res: Response) => {
    try {
        const instance = await healthChart.deployed();
        const events = await instance.getEventsForPatient(req.params.ssn);
    }
    catch(e) {
        console.log(e);
        return res.sendStatus(500);
    }
});

router.post('/:ssn/events',async (req : Request, res : Response) => {
    try {
        const instance = await healthChart.deployed();
        const result = await instance.addHealthEvent(
            req.params.ssn,
            req.body.details,
            {from : req.body.doctor} //Todo change to cookie or smth
        );
        console.log(result);
        return res.sendStatus(200);
    }
    catch(e) {
        console.log(e);
        return res.sendStatus(500);
    }
});


module.exports = router