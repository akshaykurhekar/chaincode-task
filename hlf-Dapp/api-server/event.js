'use strict';

const fs = require('fs');
const path = require('path');
const { Wallets, Gateway } = require('fabric-network');


const emitEvent = async (userID) => {
    
    // const userID="admin";
    const orgID = 'Org1';
    const channelName = 'mychannel';
    const chaincodeName = 'chaincode7';

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
    
    function showTransactionData(transactionData) {
        console.log(JSON.stringify(transactionData))
        const creator = transactionData.actions[0].header.creator;
        console.log(`    - submitted by: ${creator.mspid}-${creator.id_bytes.toString('hex')}`);
        for (const endorsement of transactionData.actions[0].payload.action.endorsements) {
            console.log(`    - endorsed by: ${endorsement.endorser.mspid}-${endorsement.endorser.id_bytes.toString('hex')}`);
        }
        const chaincode = transactionData.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec;
        console.log(`    - chaincode:${chaincode.chaincode_id.name}`);
        console.log(`    - function:${chaincode.input.args[0].toString()}`);
        for (let x = 1; x < chaincode.input.args.length; x++) {
            console.log(`    - arg:${chaincode.input.args[x].toString()}`);
        }
    }


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

        // store this obj in mongoDB 

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