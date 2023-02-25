//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract HealthChart {
    address private owner;

    uint32 public doctor_id = 0;
    uint32 public pacient_id = 0;
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

    struct patient {        
        string SSN;
        string FirstName;
        string LastName;
        address CurrantDoctor;
    }
    mapping(uint32 => patient) public patients;

    struct healthEvent {
        uint32 PatientId;
        address DoctorAddress; //Added by doctor
        string EventData; //can be anything string for now
        uint32 EventTimeStamp;
    }
    mapping(uint128 => healthEvent) public healthEvents;
    mapping(uint128 => uint128[]) public eventsForPatient; //Track the events for a patient
    
    event UpdateChart(uint32 healthEventId);
    event TransferPatient(uint32 patientId);
  
    constructor()  {
        owner = msg.sender;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }

    //A doctor can be added <- by who? only the owner
    function addDoctor(string memory _userName, 
                        string memory _passWord, 
                        address _doctorAddress, 
                        string memory _firstName, 
                        string memory _lastName) public returns (uint32) {
        //TODO: Add check for owner
        require(isOwner());

        uint32 id = doctor_id++;
        doctors[id].UserName = _userName;
        doctors[id].Password = _passWord;
        doctors[id].DoctorAddress = _doctorAddress;
        doctors[id].FirstName = _firstName;
        doctors[id].LastName = _lastName;

        doctorAddresses[_doctorAddress] = id;

        return id;
    }
    
    //A doctor can add a patient
    function addPatient(string memory _ssn,
                        string memory _firstName,
                        string memory _lastName) public returns (uint32) {
                            uint32 id = pacient_id++;
                            patients[id].SSN = _ssn;
                            patients[id].FirstName = _firstName;
                            patients[id].LastName = _lastName;
                            patients[id].CurrantDoctor = msg.sender;
                            return id;
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
    function transferPatient(uint32 _currentDoctorId, uint32 _newDoctorId, uint32 _patientId) public returns (bool) {
        require(patients[_patientId].CurrantDoctor == doctors[_currentDoctorId].DoctorAddress);
        patients[_patientId].CurrantDoctor = doctors[_newDoctorId].DoctorAddress;
        emit TransferPatient(_patientId);

        return true;
    }

    //A doctor can add a new event for a particular patient
    function addHealthEvent(uint32 _patientId, string memory _eventData) public returns (uint128) {
        uint128 id = event_id++;
        healthEvents[id].PatientId = _patientId;
        healthEvents[id].DoctorAddress = msg.sender;
        healthEvents[id].EventData = _eventData;
        healthEvents[id].EventTimeStamp = uint32(block.timestamp);
        eventsForPatient[_patientId].push(id); //Add a new event to the list
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
    function getPatient(uint32 _patientId) public view returns (string memory, string memory, string memory, address) {
        patient memory pat = patients[_patientId];
        return(pat.SSN, pat.FirstName, pat.LastName, pat.CurrantDoctor);
    }

    //Retrieve all events for a patient
    function getEventsForPatient(uint32 _patientId) public view returns (uint128[] memory) {
        return eventsForPatient[_patientId];
    }

    function getEventDetails(uint128 _eventId) public view returns (address, string memory, uint32) {
        healthEvent memory he = healthEvents[_eventId];
        return(he.DoctorAddress, he.EventData, he.EventTimeStamp);
    }
}
