import React, { useState, useEffect } from "react";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import Web3 from "web3";
import { useNavigate, useParams } from "react-router-dom";
import "../CSS/PatientWritePermission.css";
import "../big_css/CreateEHR.css";
import NavBar_Logout from "./NavBar_Logout";

const ViewDoctorProfile = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [doctorAddress, setDoctorAddress] = useState("");
  const [password, setPassword] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [bmdcNumber, setBmdcNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
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
          console.error("Error initializing Web3 or contract:", error);
          setError("Could not connect to the blockchain. Please try again.");
        }
      } else {
        setError("Please install MetaMask to access the blockchain.");
      }
    };

    const fetchDoctorDetails = async () => {
      try {
        if (contract) {
          const result = await contract.methods.getDoctorDetails(hhNumber).call();
          // Assuming result contains values in the expected order
          setDoctorAddress(result[0]);
          setDoctorName(result[1]);
          setHospitalName(result[2]);
          setSpecialization(result[3]);
          setBmdcNumber(result[4]);
          setPhoneNumber(result[5]);
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        setError("Could not retrieve doctor details. Please try again.");
      }
    };

    initWeb3();
    if (contract) {
      fetchDoctorDetails();
    }
  }, [contract, hhNumber]);

  const closeProfile = () => {
    navigate(`/doctor/${hhNumber}`);
  };

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white flex flex-col justify-center items-center">
        <div className="h-full max-w-8xl bg-gray-700 p-24 rounded-lg shadow-lg flex flex-col justify-center items-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Doctor's Profile</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {doctorName ? (
            <div>
              <center>
                <p className="text-xl sm:text-2xl mb-2">
                  Name : <span className="font-bold text-yellow-500">{doctorName}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-2">
                  Hospital Name : <span className="font-bold text-yellow-500">{hospitalName}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-2">
                  Specialization : <span className="font-bold text-yellow-500">{specialization}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-2">
                  BMDC Number : <span className="font-bold text-yellow-500">{bmdcNumber}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-2">
                  Phone Number : <span className="font-bold text-yellow-500">{phoneNumber}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-2">
                  HH Number : <span className="font-bold text-yellow-500">{hhNumber}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-2">
                  Wallet Address : <span className="font-bold text-yellow-500">{doctorAddress}</span>
                </p>
              </center>
            </div>
          ) : (
            !error && <p className="text-xl sm:text-2xl">Loading doctor details...</p>
          )}
          <div className="col-span-full">
            <button
              onClick={closeProfile}
              className="px-5 py-2.5 bg-custom-teal text-white font-bold text-lg rounded-lg cursor-pointer mt-3 transition-transform hover:bg-gray-400 transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDoctorProfile;
