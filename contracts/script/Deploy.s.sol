// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {IPIPO} from "../src/IPIPO.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        
        console.log("Deploying IPIPO contract...");
        console.log("Deployer address:", deployerAddress);
        console.log("Deployer balance:", deployerAddress.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the IPIPO contract
        // Base URI can be updated later to point to IPFS
        string memory baseURI = "https://ipipo.app/api/metadata/";
        address feeRecipient = deployerAddress; // Platform fee recipient
        
        IPIPO ipipo = new IPIPO(baseURI, feeRecipient);
        
        vm.stopBroadcast();
        
        console.log("IPIPO deployed at:", address(ipipo));
        console.log("Platform fee recipient:", feeRecipient);
        console.log("Base URI:", baseURI);
        
        // Log some useful info
        console.log("========================================");
        console.log("Deployment Summary:");
        console.log("========================================");
        console.log("Contract Address:", address(ipipo));
        console.log("Owner:", ipipo.owner());
        console.log("Platform Fee:", ipipo.platformFee(), "bp"); // basis points
        console.log("Fee Recipient:", ipipo.feeRecipient());
        console.log("Next Campaign ID:", ipipo.getNextCampaignId());
        console.log("========================================");
        
        // Save deployment info to a file for frontend
        string memory contractInfo = string.concat(
            "{\n",
            '  "contractAddress": "', vm.toString(address(ipipo)), '",\n',
            '  "owner": "', vm.toString(ipipo.owner()), '",\n',
            '  "platformFee": ', vm.toString(ipipo.platformFee()), ',\n',
            '  "feeRecipient": "', vm.toString(ipipo.feeRecipient()), '",\n',
            '  "baseURI": "', baseURI, '",\n',
            '  "deploymentBlock": ', vm.toString(block.number), '\n',
            "}"
        );
        
        vm.writeFile("./deployment.json", contractInfo);
        console.log("Deployment info saved to deployment.json");
    }
}
