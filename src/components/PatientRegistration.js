import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import { useNavigate } from "react-router-dom";
import "../CSS/PatientRegistration.css";
import NavBar from "./NavBar";

const PatientRegistry = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [hhNumber, sethhNumber] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");
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
          const deployedNetwork = PatientRegistration.networks[networkId];
          if (!deployedNetwork) {
            alert("Smart contract not deployed on the current network.");
            return;
          }
          const contractInstance = new web3Instance.eth.Contract(
            PatientRegistration.abi,
            deployedNetwork.address
          );
          setContract(contractInstance);
        } catch (error) {
          console.error("User denied account access.");
        }
      } else {
        alert("Please install MetaMask!");
      }
    };

    init();
  }, []);

  const validateInputs = () => {
    let validationErrors = {};
    if (!walletAddress) validationErrors.walletAddress = "Wallet Address is required.";
    if (!hhNumber) validationErrors.hhNumber = "HH Number is required.";
    if (!password) validationErrors.password = "Password is required.";
    if (!name) validationErrors.name = "Name is required.";
    if (!dateOfBirth) validationErrors.dateOfBirth = "Date of Birth is required.";
    if (!gender) validationErrors.gender = "Gender is required.";
    if (!bloodGroup) validationErrors.bloodGroup = "Blood Group is required.";
    if (!nationalId) validationErrors.nationalId = "National ID is required.";
    if (!phoneNumber) validationErrors.phoneNumber = "Phone Number is required.";
    if (phoneNumber && phoneNumber.length !== 10) validationErrors.phoneNumber = "Phone number must be 10 digits.";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    try {
      await contract.methods
        .registerPatient(
          walletAddress,
          hhNumber,
          password,
          name,
          dateOfBirth,
          gender,
          bloodGroup,
          nationalId,
          phoneNumber,
          residentialAddress
        )
        .send({ from: walletAddress });

      alert("Patient registered successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="form-container">
        <h2>Patient Registration</h2>
        <form>
          <input
            type="text"
            placeholder="Wallet Address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
          {errors.walletAddress && <p className="error">{errors.walletAddress}</p>}
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
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="error">{errors.name}</p>}
          <input
            type="date"
            placeholder="Date of Birth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
          {errors.dateOfBirth && <p className="error">{errors.dateOfBirth}</p>}
          <input
            type="text"
            placeholder="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
          {errors.gender && <p className="error">{errors.gender}</p>}
          <input
            type="text"
            placeholder="Blood Group"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
          />
          {errors.bloodGroup && <p className="error">{errors.bloodGroup}</p>}
          <input
            type="text"
            placeholder="National ID"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
          />
          {errors.nationalId && <p className="error">{errors.nationalId}</p>}
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
          <input
            type="text"
            placeholder="Residential Address"
            value={residentialAddress}
            onChange={(e) => setResidentialAddress(e.target.value)}
          />
          <button type="button" onClick={handleRegister}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistry;
