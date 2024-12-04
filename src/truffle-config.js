module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "0.8.19", // Match the Solidity version
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
        viaIR: true, // Enable the intermediate representation
      },
    },
  },
};
