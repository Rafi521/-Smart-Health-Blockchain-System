// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PatientRegistration {
    struct Patient {
        address walletAddress;
        string hhNumber;
        string password;
        string name;
        string dateOfBirth;
        string gender;
        string bloodGroup;
        string nidNumber;
        string phoneNumber;
        string residentialAddress;
    }

    struct PatientRecord {
        string ipfsHash;
        string recordName;
    }

    struct PatientList {
        string patient_number;
        string patient_name;
    }

    mapping(string => bool) public isPatientRegistered;
    mapping(string => Patient) public patients;
    mapping(string => PatientRecord[]) private patientRecords;
    mapping(string => PatientList[]) private Dpermission;
    mapping(string => mapping(string => bool)) public doctorPermissions;

    event PatientRegistered(string hhNumber, string name, address walletAddress);
    event RecordUploaded(string hhNumber, string ipfsHash, string recordName);

    function registerPatient(
        address _walletAddress,
        string memory _hhNumber,
        string memory _password,
        string memory _name,
        string memory _dateOfBirth,
        string memory _gender,
        string memory _bloodGroup,
        string memory _nidNumber,
        string memory _phoneNumber,
        string memory _residentialAddress
    ) external {
        require(!isPatientRegistered[_hhNumber], "Patient already registered");

        Patient memory newPatient = Patient({
            walletAddress: _walletAddress,
            hhNumber: _hhNumber,
            password: _password,
            name: _name,
            dateOfBirth: _dateOfBirth,
            gender: _gender,
            bloodGroup: _bloodGroup,
            nidNumber: _nidNumber,
            phoneNumber: _phoneNumber,
            residentialAddress: _residentialAddress
        });

        patients[_hhNumber] = newPatient;
        isPatientRegistered[_hhNumber] = true;
        emit PatientRegistered(_hhNumber, _name, _walletAddress);
    }

    function isRegisteredPatient(string memory _hhNumber) external view returns (bool) {
        return isPatientRegistered[_hhNumber];
    }

    function validatePassword(string memory _hhNumber, string memory _password) external view returns (bool) {
        require(isPatientRegistered[_hhNumber], "Patient not registered");
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(patients[_hhNumber].password));
    }

    function uploadRecord(
        string memory _hhNumber,
        string memory _ipfsHash,
        string memory _recordName
    ) external {
        require(isPatientRegistered[_hhNumber], "Patient not registered");
        patientRecords[_hhNumber].push(PatientRecord(_ipfsHash, _recordName));
        emit RecordUploaded(_hhNumber, _ipfsHash, _recordName);
    }

    function getPatientRecords(string memory _hhNumber) external view returns (PatientRecord[] memory) {
        require(isPatientRegistered[_hhNumber], "Patient not registered");
        return patientRecords[_hhNumber];
    }

    function grantPermission(
        string memory _patientNumber,
        string memory _doctorNumber,
        string memory _patientName
    ) external {
        require(!doctorPermissions[_patientNumber][_doctorNumber], "Access already granted to the doctor!");

        bool exists = false;
        for (uint256 i = 0; i < Dpermission[_doctorNumber].length; i++) {
            if (
                keccak256(abi.encodePacked(Dpermission[_doctorNumber][i].patient_number)) ==
                keccak256(abi.encodePacked(_patientNumber))
            ) {
                exists = true;
                break;
            }
        }

        if (!exists) {
            PatientList memory newRecord = PatientList(_patientNumber, _patientName);
            Dpermission[_doctorNumber].push(newRecord);
        }
        doctorPermissions[_patientNumber][_doctorNumber] = true;
    }

    function isPermissionGranted(string memory _patientNumber, string memory _doctorNumber) external view returns (bool) {
        return doctorPermissions[_patientNumber][_doctorNumber];
    }

    function getPatientList(string memory _doctorNumber) public view returns (PatientList[] memory) {
        return Dpermission[_doctorNumber];
    }

    function getPatientDetails(string memory _hhNumber)
        external
        view
        returns (
            address walletAddress,
            string memory hhNumber,
            string memory name,
            string memory dateOfBirth,
            string memory gender,
            string memory bloodGroup,
            string memory nidNumber,
            string memory phoneNumber,
            string memory residentialAddress
        )
    {
        require(isPatientRegistered[_hhNumber], "Patient not registered");

        Patient memory patient = patients[_hhNumber];
        return (
            patient.walletAddress,
            patient.hhNumber,
            patient.name,
            patient.dateOfBirth,
            patient.gender,
            patient.bloodGroup,
            patient.nidNumber,
            patient.phoneNumber,
            patient.residentialAddress
        );
    }
}
