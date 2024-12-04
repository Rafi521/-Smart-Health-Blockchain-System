import React, { useEffect, useState } from "react";
import Web3 from "web3";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json"; // Ensure this path is correct

const GrantPermission = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [doctorNumber, setDoctorNumber] = useState("");
  const [patientNumber, setPatientNumber] = useState("");
  const [patientName, setPatientName] = useState("");

  // Initialize Web3 and Contract
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
      } catch (err) {
        setError(err.message);
      }
    };

    initWeb3AndContract();
  }, []);

  // Grant Permission Function
  const handleGrantPermission = async () => {
    try {
      if (!doctorNumber || !patientNumber || !patientName) {
        throw new Error("All fields are required.");
      }
      const accounts = await web3.eth.requestAccounts();
      await contract.methods.grantPermission(patientNumber, doctorNumber, patientName).send({
        from: accounts[0],
      });
      setSuccess("Permission granted successfully!");
      setError(null);
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <div>
      <h2>Grant Permission</h2>
      <input
        type="text"
        placeholder="Doctor Number"
        value={doctorNumber}
        onChange={(e) => setDoctorNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Patient Number"
        value={patientNumber}
        onChange={(e) => setPatientNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Patient Name"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
      />
      <button onClick={handleGrantPermission}>Grant Permission</button>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GrantPermission;
