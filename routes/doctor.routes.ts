import express from 'express'
import { healthChart, DEFAULT_ACCOUNT } from '../server'
import { Doctor } from '../types/api/interfaces'
import { Request, Response } from 'express'

const router = express.Router()

/*Get doctor info*/
router.get('/:id', async (req : Request, res : Response) => {
    try {
        const instance = await healthChart.deployed();
        if (req.params.id.startsWith('0x')) {
            const doctor = await instance.methods['getDoctor(address)'](req.params.id);
            const doctor_result : Doctor = {
                id : doctor[0],
                address : req.params.id,
                firstName : doctor[1],
                lastName : doctor[2]
            };
            console.log(doctor_result);
            return res.json(doctor_result);
        }
        else {
            const doctor = await instance.methods['getDoctor(uint32)'](req.params.id);
            const doctor_result : Doctor = {
                id : req.params.id,
                address : doctor[0],
                firstName : doctor[1],
                lastName : doctor[2]
            };
            console.log(doctor_result);
            return res.json(doctor_result);
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500);
    }
});

/*{
    'username' : 'user',
    'password' : 'pass',
    'address'  : 'hash',
    'firstname' : 'F Name',
    'lastName' : 'L Name',
}*/
/*Add a doctor*/
router.post('/', async (req : Request, res : Response) => {
    try {
        const instance = await healthChart.deployed();
        const result = await instance.addDoctor(
            req.body.username,
            req.body.password,
            req.body.address,
            req.body.firstname,
            req.body.lastname,
            { from: DEFAULT_ACCOUNT });

        console.log(result);
        return res.status(200);
    }
    catch (e) {
        console.log(e);
        return res.status(500);
    }
});


module.exports = router