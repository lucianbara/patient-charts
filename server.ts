const contract = require('@truffle/contract');
import Web3 from 'web3';
import express from 'express';
import { Doctor, Patient, HealthEvent } from "./types/api/interfaces"

const DEFAULT_ACCOUNT = "0xE806a93498d28A434a2A458fF61872981DA3F35E";

const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
const web3 = new Web3(provider);

const healthChart = contract(require('./build/contracts/HealthChart.json'))
healthChart.setProvider(provider);
export {healthChart, DEFAULT_ACCOUNT};


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const doctorRoutes = require('./routes/doctor.routes');
const patientRoutes = require('./routes/patient.routes');
const eventRoutes = require('./routes/event.routes');
app.use('/api/healthchart/doctor', doctorRoutes);
app.use('/api/healthchart/patient', patientRoutes);
app.use('/api/healtchart/event', eventRoutes);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});