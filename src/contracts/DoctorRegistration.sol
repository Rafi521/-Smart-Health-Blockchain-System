// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DoctorRegistration {
    struct Doctor {
        address walletAddress; // Doctor's wallet address
        string hhNumber; // Unique health identifier
        string password; // Doctor's password for verification
        string doctorName; // Full name
        string hospitalName; // Affiliated hospital
        string specialization; // Medical specialization
        string bmdcNumber; // BMDC registration number
        string phoneNumber; // Contact number
    }

    struct PatientList {
        string patient_number;
        string patient_name;
    }

    mapping(string => address) private doctorAddresses;
    mapping(string => Doctor) private doctors;
    mapping(string => PatientList[]) private Dpermission;
    mapping(string => mapping(string => bool)) public doctorPermissions;

    event DoctorRegistered(string hhNumber, string doctorName, address walletAddress);

    function registerDoctor(
        address _walletAddress,
        string memory _hhNumber,
        string memory _password,
        string memory _doctorName,
        string memory _hospitalName,
        string memory _specialization,
        string memory _bmdcNumber,
        string memory _phoneNumber
    ) external {
        require(doctorAddresses[_hhNumber] == address(0), "Doctor already registered");

        Doctor memory newDoctor = Doctor({
            walletAddress: _walletAddress,
            hhNumber: _hhNumber,
            password: _password,
            doctorName: _doctorName,
            hospitalName: _hospitalName,
            specialization: _specialization,
            bmdcNumber: _bmdcNumber,
            phoneNumber: _phoneNumber
        });

        doctors[_hhNumber] = newDoctor;
        doctorAddresses[_hhNumber] = _walletAddress;
        emit DoctorRegistered(_hhNumber, _doctorName, _walletAddress);
    }

    function validatePassword(string memory _hhNumber, string memory _password) external view returns (bool) {
        require(doctorAddresses[_hhNumber] != address(0), "Doctor not registered");
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(doctors[_hhNumber].password));
    }

    function isRegisteredDoctor(string memory _hhNumber) external view returns (bool) {
        return doctorAddresses[_hhNumber] != address(0);
    }

    function getDoctorDetails(string memory _hhNumber) external view returns (
        address walletAddress,
        string memory doctorName,
        string memory hospitalName,
        string memory specialization,
        string memory bmdcNumber,
        string memory phoneNumber
    ) {
        require(doctorAddresses[_hhNumber] != address(0), "Doctor not registered");
        Doctor memory doctor = doctors[_hhNumber];
        return (
            doctor.walletAddress,
            doctor.doctorName,
            doctor.hospitalName,
            doctor.specialization,
            doctor.bmdcNumber,
            doctor.phoneNumber
        );
    }

    function grantPermission(
        string memory _patientNumber,
        string memory _doctorNumber,
        string memory _patientName
    ) external {
        PatientList memory newRecord = PatientList(
            _patientNumber,
            _patientName
        );
        Dpermission[_doctorNumber].push(newRecord);
        doctorPermissions[_patientNumber][_doctorNumber] = true;
    }

    function revokePermission(string memory _patientNumber, string memory _doctorNumber) public {
        doctorPermissions[_patientNumber][_doctorNumber] = false;

        for (uint i = 0; i < Dpermission[_doctorNumber].length; i++) {
            if (keccak256(abi.encodePacked(Dpermission[_doctorNumber][i].patient_number)) == keccak256(abi.encodePacked(_patientNumber))) {
                for (uint j = i; j < Dpermission[_doctorNumber].length - 1; j++) {
                    Dpermission[_doctorNumber][j] = Dpermission[_doctorNumber][j + 1];
                }
                Dpermission[_doctorNumber].pop();
                break;
            }
        }
    }

    function getPatientList(string memory _doctorNumber) public view returns (PatientList[] memory) {
        return Dpermission[_doctorNumber];
    }
}
