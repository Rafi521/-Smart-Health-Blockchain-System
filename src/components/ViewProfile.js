import React, { useState, useEffect } from "react";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import Web3 from "web3";
import { useNavigate, useParams } from "react-router-dom";
import "../CSS/PatientWritePermission.css";
import "../big_css/CreateEHR.css";
import NavBar_Logout from "./NavBar_Logout";

const ViewProfile = () => {
  const { hhNumber } = useParams(); // Retrieve the hhNumber from the URL parameter
  const navigate = useNavigate();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [patientDetails, setPatientDetails] = useState({
    walletAddress: "",
    hhNumber: "",
    password: "",
    name: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    nationalId: "",
    phoneNumber: "",
    residentialAddress: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = PatientRegistration.networks[networkId];
          if (!deployedNetwork) {
            console.error("Contract not deployed on the current network.");
            setError("Contract not deployed on the current network.");
            return;
          }

          const contractInstance = new web3Instance.eth.Contract(
            PatientRegistration.abi,
            deployedNetwork.address
          );
          setContract(contractInstance);

          // Fetch patient details
          const result = await contractInstance.methods.getPatientDetails(hhNumber).call();
          setPatientDetails({
            walletAddress: result.walletAddress,
            hhNumber: result.hhNumber,
            password: result.password, // This might not be fetched from the smart contract for security reasons
            name: result.name,
            dateOfBirth: result.dateOfBirth,
            gender: result.gender,
            bloodGroup: result.bloodGroup,
            nationalId: result.nationalId,
            phoneNumber: result.phoneNumber,
            residentialAddress: result.residentialAddress,
          });
        } catch (err) {
          console.error("Error retrieving patient details:", err);
          setError("Error retrieving patient details.");
        }
      } else {
        console.error("Please install MetaMask extension.");
        setError("Please install MetaMask extension.");
      }
    };

    init();
  }, [hhNumber]);

  const cancelOperation = () => {
    navigate(`/patient/${hhNumber}`);
  };

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white flex flex-col justify-center items-center">
        <div className="h-full max-w-8xl bg-gray-700 p-24 rounded-lg shadow-lg flex flex-col justify-center items-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Profile</h1>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div>
              <center>
                <p className="text-xl sm:text-2xl mb-3">
                  Wallet Address:{" "}
                  <span className="font-bold text-yellow-500">{patientDetails.walletAddress}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-3">
                  HH Number:{" "}
                  <span className="font-bold text-yellow-500">{patientDetails.hhNumber}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-3">
                  Full Name:{" "}
                  <span className="font-bold text-yellow-500">{patientDetails.name}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-3">
                  Date of Birth:{" "}
                  <span className="font-bold text-yellow-500">{patientDetails.dateOfBirth}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-3">
                  Gender:{" "}
                  <span className="font-bold text-yellow-500">{patientDetails.gender}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-3">
                  Blood Group:{" "}
                  <span className="font-bold text-yellow-500">{patientDetails.bloodGroup}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-3">
                  National ID:{" "}
                  <span className="font-bold text-yellow-500">{patientDetails.nationalId}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-3">
                  Phone Number:{" "}
                  <span className="font-bold text-yellow-500">{patientDetails.phoneNumber}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-3">
                  Residential Address:{" "}
                  <span className="font-bold text-yellow-500">{patientDetails.residentialAddress}</span>
                </p>
              </center>
            </div>
          )}
          <div className="col-span-full">
            <button
              onClick={cancelOperation}
              className="px-5 py-2.5 bg-custom-teal text-white font-bold text-lg rounded-lg cursor-pointer mt-3 mr-5 transition-transform transition-background-color duration-300 ease-in hover:bg-gray-400 transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
