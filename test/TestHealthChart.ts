const HealthChart = artifacts.require('HealthChart');

//Add two doctors
contract('HealthChart', ([deployer]) => {
    it('should create a Doctor', async () => {
        let instance = await HealthChart.deployed();
        let doctor = await instance.addDoctor('doctordoctor', 'password1', '0xE806a93498d28A434a2A458fF61872981DA3F35E', 'Doctor', 'Strange');
        let doctorById = await instance.methods['getDoctor(uint32)'](0);   
        assert(doctorById[0] === '0xE806a93498d28A434a2A458fF61872981DA3F35E');
        assert(doctorById[1] === 'Doctor');
        assert(doctorById[2] === 'Strange');
        let doctorByAddress = await instance.methods['getDoctor(address)']('0xE806a93498d28A434a2A458fF61872981DA3F35E');  
        assert(doctorByAddress[0].toString() === '0');
        assert(doctorByAddress[1] === 'Doctor');
        assert(doctorByAddress[2] === 'Strange'); 
    });

    it('should create a second Doctor', async () => {
        let instance = await HealthChart.deployed();
        let doctor = await instance.addDoctor('doctordoctor1', 'password1', '0xfCB55cBDb99d5b153D339C2076e423dbFa878353', 'Doctor', 'Strange');
        let doctorById = await instance.methods['getDoctor(uint32)'](1);   
        assert(doctorById[0] === '0xfCB55cBDb99d5b153D339C2076e423dbFa878353');
        assert(doctorById[1] === 'Doctor');
        assert(doctorById[2] === 'Strange');
        let doctorByAddress = await instance.methods['getDoctor(address)']('0xfCB55cBDb99d5b153D339C2076e423dbFa878353');  
        assert(doctorByAddress[0].toString() === '1');
        assert(doctorByAddress[1] === 'Doctor');
        assert(doctorByAddress[2] === 'Strange'); 
    });

    
    it('should create a third Doctor', async () => {
        let instance = await HealthChart.deployed();
        let doctor = await instance.addDoctor('doctordoctor4', 'password1', '0x24970febdb512006720c0a1a7C559655C483b554', 'Doctor', 'Strange');
        let doctorById = await instance.methods['getDoctor(uint32)'](2);   
        assert(doctorById[0] === '0x24970febdb512006720c0a1a7C559655C483b554');
        assert(doctorById[1] === 'Doctor');
        assert(doctorById[2] === 'Strange');
        let doctorByAddress = await instance.methods['getDoctor(address)']('0x24970febdb512006720c0a1a7C559655C483b554');  
        assert(doctorByAddress[0].toString() === '2');
        assert(doctorByAddress[1] === 'Doctor');
        assert(doctorByAddress[2] === 'Strange'); 
    });


    
    it('should add a patient', async () => {
        let instance = await HealthChart.deployed();
        let patient_add = await instance.addPatient('1890000000000', 'L', 'B');
        let patient = await instance.getPatient('1890000000000');
        assert(patient[0] === 'L');
        assert(patient[1] === 'B');
        assert(patient[2] === '0xE806a93498d28A434a2A458fF61872981DA3F35E'); //First address in the block chain
    });

    it('should transfer the patient to the second doctor', async () => {
        let instance = await HealthChart.deployed();
        let patneientId = await instance.transferPatient(1, '1890000000000');
        let patient = await instance.getPatient('1890000000000');
        assert(patient[0] === 'L');
        assert(patient[1] === 'B');
        assert(patient[2] === '0xfCB55cBDb99d5b153D339C2076e423dbFa878353'); //First address in the block chain
    });

    it('Should add a health event for the first patient', async () => {
        let instance = await HealthChart.deployed();
        let eventId = await instance.addHealthEvent('1890000000000', 'Broke leg while sking');
        let event = await instance.getEventsForPatient('1890000000000');
        assert(event[0].toString() === '0');
        let eventDetails = await instance.getEventDetails(0);
        assert(eventDetails[0] ===  '0xE806a93498d28A434a2A458fF61872981DA3F35E');
        assert(eventDetails[1] ===  'Broke leg while sking');

    });


    it('Should add a health event for the first patient, by the second doctor', async () => {
        let instance = await HealthChart.deployed();
        let eventId = await instance.addHealthEvent('1890000000000', 'Broke another leg while walking', {from: '0xfCB55cBDb99d5b153D339C2076e423dbFa878353'});
        let event = await instance.getEventsForPatient('1890000000000');
        assert(event[0].toString() === '0');
        assert(event[1].toString() === '1');
        let eventDetails = await instance.getEventDetails(1);
        assert(eventDetails[0] ===  '0xfCB55cBDb99d5b153D339C2076e423dbFa878353');
        assert(eventDetails[1] ===  'Broke another leg while walking');

    });
});