import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useParams } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import "../CSS/ViewPatientList.css";

const ViewPatientList = () => {
  const { hhNumber } = useParams();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initWeb3AndContract = async () => {
      try {
        if (!window.ethereum) {
          throw new Error("MetaMask not detected. Please install it to continue.");
        }

        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = DoctorRegistration.networks[networkId];
        if (!deployedNetwork) {
          throw new Error("Contract not deployed on the current network.");
        }

        const contractInstance = new web3Instance.eth.Contract(
          DoctorRegistration.abi,
          deployedNetwork.address
        );
        setContract(contractInstance);

        const accounts = await web3Instance.eth.requestAccounts();
        const patientList = await contractInstance.methods.getPatientList(hhNumber).call({
          from: accounts[0],
        });
        setPatients(patientList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initWeb3AndContract();
  }, [hhNumber]);

  return (
    <div>
      <NavBar_Logout />
      <h2>Patient List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <ul>
          {patients.map((patient, index) => (
            <li key={index}>
              <p>Patient Number: {patient.patient_number}</p>
              <p>Name: {patient.patient_name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewPatientList;
