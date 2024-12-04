import React, { useState, useEffect } from "react";
import Web3 from "web3";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import { useNavigate } from "react-router-dom";
import "../CSS/DoctorRegistration.css";
import NavBar from "./NavBar";

const DoctorRegistry = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [doctorAddress, setDoctorAddress] = useState("");
  const [hhNumber, sethhNumber] = useState("");
  const [password, setPassword] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [bmdcNumber, setBmdcNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = DoctorRegistration.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            DoctorRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contractInstance);
        } catch (error) {
          console.error("User denied account access.");
        }
      } else {
        console.log("Please install MetaMask!");
      }
    };

    init();
  }, []);

  const validateInputs = () => {
    let validationErrors = {};
    if (!hhNumber) validationErrors.hhNumber = "HH Number is required.";
    if (!password) validationErrors.password = "Password is required.";
    if (!doctorName) validationErrors.doctorName = "Doctor name is required.";
    if (!hospitalName) validationErrors.hospitalName = "Hospital name is required.";
    if (!specialization) validationErrors.specialization = "Specialization is required.";
    if (!bmdcNumber) validationErrors.bmdcNumber = "BMDC number is required.";
    if (!phoneNumber) validationErrors.phoneNumber = "Phone number is required.";
    if (phoneNumber && phoneNumber.length !== 10) validationErrors.phoneNumber = "Phone number must be 10 digits.";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    try {
      await contract.methods
        .registerDoctor(
          doctorAddress,
          hhNumber,
          password,
          doctorName,
          hospitalName,
          specialization,
          bmdcNumber,
          phoneNumber
        )
        .send({ from: doctorAddress });

      alert("Doctor registered successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error while registering:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="form-container">
        <h2>Doctor Registration</h2>
        <form>
          <input
            type="text"
            placeholder="Wallet Address"
            value={doctorAddress}
            onChange={(e) => setDoctorAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="HH Number"
            value={hhNumber}
            onChange={(e) => sethhNumber(e.target.value)}
          />
          {errors.hhNumber && <p className="error">{errors.hhNumber}</p>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error">{errors.password}</p>}
          <input
            type="text"
            placeholder="Doctor Name"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Hospital Name"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
          <input
            type="text"
            placeholder="BMDC Number"
            value={bmdcNumber}
            onChange={(e) => setBmdcNumber(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
          <button type="button" onClick={handleRegister}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegistry;
