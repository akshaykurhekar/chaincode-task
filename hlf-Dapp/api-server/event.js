'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Event = require('./eventSchema');
const { Wallets, Gateway } = require('fabric-network');


const emitEvent = async (userID) => {
    
    // const userID="admin";
    const orgID = 'Org1';
    const channelName = 'mychannel';
    const chaincodeName = 'chaincode11';

    const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', `${orgID}.example.com`.toLowerCase(), `connection-${orgID}.json`.toLowerCase());
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(userID);
    if (!identity) {
        console.log(`An identity for the user ${userID} does not exist in the wallet`);
        console.log('Run the registerUser.js application before retrying');
        return {
            statusCode: 200,
            status: false,
            message: `An identity for the user ${userID} does not exist.`
        };
    }
       
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userID, discovery: { enabled: true, asLocalhost: true } });
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);
    // Get the contract from the network.
    const contract = network.getContract(chaincodeName);
    
    const contractListener = async (event) => {
        console.log("==========================================")
        console.log(event)
        // The payload of the chaincode event is the value place there by the
        // chaincode. Notice it is a byte data and the application will have
        // to know how to deserialize.
        // In this case we know that the chaincode will always place the asset
        // being worked with as the payload for all events produced.
        const asset = JSON.parse(event.payload.toString());
           

        console.log(`<-- Contract Event Received: ${event.eventName} - ${JSON.stringify(asset)}`);
        // console.log(`<-- Contract Event Received: ${event.eventName} - ${asset}`);
        // show the information available with the event
        console.log(`*** Event: ${event.eventName}:${asset.userName}`);
        // notice how we have access to the transaction information that produced this chaincode event
        const eventTransaction = event.getTransactionEvent();
        console.log(`*** transaction: ${eventTransaction.transactionId} status:${eventTransaction.status}`);
        // showTransactionData(eventTransaction.transactionData);
        // notice how we have access to the full block that contains this transaction
        const eventBlock = eventTransaction.getBlockEvent();
        console.log(`*** block: ${eventBlock.blockNumber.toString()}`);

        
        
        const objForDb = {
            eventName:event.eventName,
            asset: asset,
            transactionId:eventTransaction.transactionId,
            blockNumber:eventBlock.blockNumber.toString()
        }
        
        // -------Event backup in eventLog file
        // const data = { key1: 'value1', key2: 'value2' }; // Replace with your data in JSON format
        const eventLogPath = path.resolve(__dirname,'eventLog.json');
        // create file
        // add lgs to file
        fs.appendFileSync(eventLogPath, JSON.stringify(objForDb) + '\n');

        // console.log("Event ready to DB => ", objForDb)
        // store this obj in mongoDB 

        const newEvent = new Event({
            eventName:event.eventName,
            userName:asset.userName,
            assetData: asset.assetData,
            transactionId:eventTransaction.transactionId,
            blockNumber:eventBlock.blockNumber.toString()
        });

        newEvent.save().then((res)=>{
            console.log(res, );
        }).catch((e) => {
            console.log(e);
        })

        // return result;
    };

 
  

    try {

        await contract.addContractListener(contractListener);
    }catch(error){
        console.log('error in listener',error);
    }

      // Keep the listener active until the client disconnects
      
        // Unsubscribe from event when the client disconnects
        // contract.removeContractListener(listener);
       
    // Disconnect from the gateway.
    await gateway.disconnect();              

}

module.exports = {emitEvent};