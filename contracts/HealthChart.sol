//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract HealthChart {
    address private owner;

    uint32 public doctor_id = 0;
    uint128 public event_id = 0;

    struct doctor {
        address DoctorAddress;
        string UserName;
        string Password;
        string FirstName;
        string LastName;
    }   
    mapping(uint32 => doctor) public doctors;
    mapping(address => uint32) public doctorAddresses;
    mapping(string => doctor) public doctorUsers;

    struct patient {        
        string SSN;
        string FirstName;
        string LastName;
        address CurrantDoctor;
    }
    mapping(string => patient) public patients; //patient SSN

    struct healthEvent {
        string PatientSsn;
        address DoctorAddress; //Added by doctor
        string EventData; //can be anything string for now
        uint32 EventTimeStamp;
    }
    mapping(uint128 => healthEvent) public healthEvents;
    mapping(string => uint128[]) public eventsForPatient; //Track the events for a patient
    
    event UpdateChart(string patientSsn, uint128 healthEventId);
    event TransferPatient(string patientSsn);
  
    constructor()  {
        owner = msg.sender;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }

    //A doctor can be added <- by who? only an existing doctor? 
    function addDoctor(string memory _userName, 
                        string memory _passWord, 
                        address _doctorAddress, 
                        string memory _firstName, 
                        string memory _lastName) public returns (uint32) {
        require(doctorUsers[_userName].DoctorAddress == address(0), "Doctor already exists in the block chain");
        uint32 id = doctor_id++;
        doctors[id].UserName = _userName;
        doctors[id].Password = _passWord;
        doctors[id].DoctorAddress = _doctorAddress;
        doctors[id].FirstName = _firstName;
        doctors[id].LastName = _lastName;

        doctorAddresses[_doctorAddress] = id;
        doctorUsers[_userName] = doctors[id];

        return id;
    }
    
    //A doctor can add a patient
    function addPatient(string memory _ssn,
                        string memory _firstName,
                        string memory _lastName) public returns (bool) {
        require(keccak256(abi.encodePacked(patients[_ssn].SSN)) == keccak256(abi.encodePacked("")), "Patient already exists in the block chain");
        patients[_ssn].SSN = _ssn;
        patients[_ssn].FirstName = _firstName;
        patients[_ssn].LastName = _lastName;
        patients[_ssn].CurrantDoctor = msg.sender;
        return true;
    }
    //A doctor can be authenticated to have access to the system
   //TODO: Just a lazy hack
   function authenticateDoctor(uint32 _id, string memory _userName, string memory _password) public view returns (bool) {
        if(keccak256(abi.encodePacked(doctors[_id].UserName)) == keccak256(abi.encodePacked(_userName)) 
        && keccak256(abi.encodePacked(doctors[_id].Password)) == keccak256(abi.encodePacked(_password)) )
            return true;
        
        return false;
   }

    //A doctor can transfer his pacient to another doctor
    function transferPatient(uint32 _newDoctorId, string memory _patientSsn) public returns (bool) {
        require(patients[_patientSsn].CurrantDoctor == msg.sender);
        patients[_patientSsn].CurrantDoctor = doctors[_newDoctorId].DoctorAddress;
        emit TransferPatient(_patientSsn);

        return true;
    }

    //Any doctor can add a new event for a particular patient - i.e. broke leg on vacation
    function addHealthEvent(string memory _patientSsn, string memory _eventData) public returns (uint128) {
        uint128 id = event_id++;
        healthEvents[id].PatientSsn = _patientSsn;
        healthEvents[id].DoctorAddress = msg.sender;
        healthEvents[id].EventData = _eventData;
        healthEvents[id].EventTimeStamp = uint32(block.timestamp);
        eventsForPatient[_patientSsn].push(id); //Add a new event to the list
        emit UpdateChart(_patientSsn, id);
        return id;
    }

    //Getters
    //Retrieve a doctor by address
    function getDoctor(address _doctorAddress) public view returns (uint32, string memory, string memory) {
        uint32 doc_id = doctorAddresses[_doctorAddress];
        return (doc_id, doctors[doc_id].FirstName, doctors[doc_id].LastName);
    }
    //Retrieve a doctor by Id
    function getDoctor(uint32 _doctorId) public view returns (address, string memory, string memory) {
        doctor memory doc = doctors[_doctorId]; //dunno
        return (doc.DoctorAddress, doc.FirstName, doc.LastName);
    }

    //Retrieve a patient
    function getPatient(string memory _patientSsn) public view returns (string memory, string memory, address) {
        patient memory pat = patients[_patientSsn];
        return(pat.FirstName, pat.LastName, pat.CurrantDoctor);
    }

    //Retrieve all events for a patient
    function getEventsForPatient(string memory _patientSsn) public view returns (uint128[] memory) {
        return eventsForPatient[_patientSsn];
    }

    function getEventDetails(uint128 _eventId) public view returns (address, string memory, uint32) {
        healthEvent memory he = healthEvents[_eventId];
        return(he.DoctorAddress, he.EventData, he.EventTimeStamp);
    }
}
