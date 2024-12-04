import React, { useState } from "react";
import { create } from "ipfs-http-client";
import PatientRegistration from "../build/contracts/PatientRegistration.json";

const UploadRecord = () => {
  // State for file input and IPFS response URL
  const [file, setFile] = useState(null);
  const [ipfsUrl, setIpfsUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Configure IPFS client to use the local IPFS Desktop node
  const ipfs = create({
    host: "127.0.0.1", // IPFS Desktop API host
    port: 5001,        // IPFS API port
    protocol: "http",  // Protocol
  });

  // Function to handle file upload to IPFS
  const uploadToIPFS = async () => {
    if (!file) {
      setError("Please select a file!");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Add file to IPFS
      const added = await ipfs.add(file);
      const url = `http://127.0.0.1:8080/ipfs/${added.path}`; // Construct file URL
      setIpfsUrl(url);
      console.log("File uploaded to IPFS:", added);
    } catch (err) {
      console.error("Error uploading file to IPFS:", err);
      setError("Failed to upload file to IPFS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Upload Record to IPFS</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ display: "block", margin: "10px 0" }}
      />
      <button
        onClick={uploadToIPFS}
        style={{
          padding: "10px 15px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload to IPFS"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {ipfsUrl && (
        <div style={{ marginTop: "15px" }}>
          <p>File uploaded to IPFS:</p>
          <a href={ipfsUrl} target="_blank" rel="noreferrer">
            {ipfsUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadRecord;
