import express from 'express'
import { healthChart, DEFAULT_ACCOUNT } from '../server'
import { Doctor, HealthEvent } from '../types/api/interfaces'
import { Request, Response } from 'express'

const router = express.Router()

/*Get event details for an event*/
router.get('/:id', async(req : Request, res : Response) => {
    try {
        const instance = await healthChart.deployed();
        const event = await instance.getEventDetails(req.params.id);
        const doctor = await instance.methods['getDoctor(address)'](event[0]);        

        const doctor_result : Doctor = {
            id : doctor[0],
            address : event[0],
            firstName : doctor[1],
            lastName : doctor[2]
        };

        const event_details : HealthEvent = {
            doctor : doctor_result, 
            eventDetails : event[1], 
            date: new Date(event[2])
        };

        return res.json(event_details);
    }
    catch(e) {
        console.log(e);
        return res.status(500);
    }

});


module.exports = router
