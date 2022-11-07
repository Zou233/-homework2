import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://127.0.0.1:7545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '4ac2fd774f27bb24dc37e2bca3ad8cecf5a8d016e6f6c2a996c559b6f787052c',
        '2b30fd161eb261f929480cd5fd2d773ff4066590bdc29dd946468c0dbc1b869b',
        '8eddb557de3ec0333d1fa963ec578252ff7481645e90354b4504a07acce37144',
        '788f1607ab3d75520d947df9209b9443bf604653320d0711176689d481fb3ae3',
        '917cb2073c0952e3fdeeda81f97f273371a02342ff09f5a0324b5ed2f3e0045f'
      ]
    },
  },
};

export default config;
