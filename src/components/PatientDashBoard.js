import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useParams, useNavigate } from "react-router-dom";
import "../CSS/PatientDashBoard.css";
import NavBar_Logout from "./NavBar_Logout";
import PatientRegistration from "../build/contracts/PatientRegistration.json";

const PatientDashBoard = () => {
  const { hhNumber } = useParams(); // Retrieve the hhNumber from the URL parameter
  const navigate = useNavigate();

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = PatientRegistration.networks[networkId];

          if (deployedNetwork) {
            const contractInstance = new web3Instance.eth.Contract(
              PatientRegistration.abi,
              deployedNetwork.address
            );
            setContract(contractInstance);

            const result = await contractInstance.methods
              .getPatientDetails(hhNumber)
              .call();
            setPatientDetails(result);
          } else {
            setError("Smart contract not deployed on the detected network.");
          }
        } catch (err) {
          console.error("Error initializing contract:", err);
          setError("Failed to connect to the smart contract.");
        }
      } else {
        setError("MetaMask is not installed. Please install it to use this application.");
      }
    };

    init();
  }, [hhNumber]);

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white h-screen flex flex-col justify-center items-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Patient Dashboard</h2>

        {error && <p className="text-red-500">{error}</p>}
        {patientDetails && (
          <p className="text-xl sm:text-2xl mb-8">
            Welcome{" "}
            <span className="font-bold text-yellow-500">
              {patientDetails.name}!
            </span>
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-5 w-full px-4 sm:px-0">
          <button
            onClick={() => navigate(`/patient/${hhNumber}/viewprofile`)}
            className="my-2 px-4 sm:px-8 py-4 sm:py-5 w-full sm:w-1/4 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
          >
            View Profile
          </button>
          
          <button
            onClick={() => navigate(`/patient/${hhNumber}/grantpermission`)}
            className="my-2 px-4 sm:px-8 py-4 sm:py-5 w-full sm:w-1/4 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
          >
            Grant Permission
          </button>

          <button
            onClick={() => navigate(`/patient/${hhNumber}/uploadrecord`)}
            className="my-2 px-4 sm:px-8 py-4 sm:py-5 w-full sm:w-1/4 rounded-lg bg-green-500 hover:bg-green-700 transition-colors duration-300"
          >
            Upload Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashBoard;
