import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useParams } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
import PatientRegistration from "../build/contracts/PatientRegistration.json";

const DoctorViewRecords = () => {
  const { hhNumber } = useParams();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const initWeb3AndContract = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = PatientRegistration.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            PatientRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contractInstance);

          const permissionGranted = await contractInstance.methods
            .isPermissionGranted(hhNumber, "doctorNumber")
            .call(); // Replace doctorNumber with actual logic

          if (!permissionGranted) {
            setError("You do not have permission to view this patient's records.");
            return;
          }

          const patientRecords = await contractInstance.methods
            .getPatientRecords(hhNumber)
            .call();
          setRecords(patientRecords);
        } else {
          setError("MetaMask is not installed.");
        }
      } catch (err) {
        console.error("Error initializing Web3 or contract:", err);
        setError("Failed to fetch data.");
      }
    };

    initWeb3AndContract();
  }, [hhNumber]);

  return (
    <div>
      <NavBar_Logout />
      <div className="container mx-auto my-4 p-4">
        <h2 className="text-xl font-bold">Patient Records</h2>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            {records.length > 0 ? (
              <ul className="list-disc pl-6">
                {records.map((record, index) => (
                  <li key={index}>
                    <strong>{record.recordName}</strong>:{" "}
                    <a
                      href={`https://ipfs.io/ipfs/${record.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Record
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No records found for this patient.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorViewRecords;
