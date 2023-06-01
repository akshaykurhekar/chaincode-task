/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const { Contract } = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity;

class DltContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        
        console.info('============= END : Initialize Ledger ===========');
    }

    
    // create project
    async createProject(ctx, args) {
        let cid = new ClientIdentity(ctx.stub);        
        const userId = await cid.getAttributeValue('userId');    
                
        args = JSON.parse(args);
        console.log("args: ", args);
        
        console.info(`============= START : Create Project by owner : ${args['owner']} ===========`);

        await ctx.stub.putState(args['projectId'], Buffer.from(JSON.stringify(args['project'])));
        console.info('============= END : Create Project ===========');

        const transactionId = ctx.stub.getTxID();
        // const obj = ctx.stub.getState(transactionId);
        // console.log('transaction Object:', obj);
        console.log('Transaction ID:', transactionId);

        const eventPayload = {
            userName:userId,
            assetData:args['project'],
            transactionId:transactionId          
        }

		const assetBuffer = Buffer.from(JSON.stringify(eventPayload));

        ctx.stub.setEvent('CreateAssetEvent', assetBuffer);
        console.info('============= CreateAssetEvent EVENT EMIT ===========');

        return {status:true, message:'Project created success'};
      
    }

     // update project
     async updateProject(ctx, args) {

        let cid = new ClientIdentity(ctx.stub);        
        const userId = await cid.getAttributeValue('userId');
        console.info(`---------------update function => User Identity : ${userId}--------`)
        args = JSON.parse(args);
        console.log("user : ", args.project.owner);

        if(userId == args.project.owner){

            console.info(`============= START : update Project by  ===========`);

            // owner can update asset with in 5mins // 5*60,000 = 300000 in millisecond
            const result = await ctx.stub.getState(args['projectId']);
            const oldData = JSON.parse(result.toString());
            const currentTime = Date.now();
            const assetTimestamp = parseInt(oldData['timestamp']);
          
            console.log(`assetTimestamp :: ${assetTimestamp}`)

            if((currentTime - assetTimestamp) <= 300000){
                
                await ctx.stub.putState(args['projectId'], Buffer.from(JSON.stringify(args['project'])));
                console.info('============= END : update Project ===========');
                
                const transactionId = ctx.stub.getTxID();

                const eventPayload = {
                    userName:userId,
                    assetData:args['project'],
                    transactionId:transactionId                    
                };

    		    const assetBuffer = Buffer.from(JSON.stringify(eventPayload));

                ctx.stub.setEvent('UpdateAssetEvent', assetBuffer);
                console.info('============= UpdateAssetEvent EVENT EMIT ===========');
                
                return {status:true, message:'Project updated success'};

            }else {
                    return {status:false, message:'owner can update project with in 5mins after creation.'};
                }

    }else {
        return {status:false, message:'user not authorized to update project'};
        }
    }

    // can query all type of assets by Id (wallet/investment/project)
    async  queryAssetById(ctx, args)
        {
            args = JSON.parse(args);
            const result = await ctx.stub.getState(args['assetId']); // get the asset from chaincode state
            console.log("Asset By ID response: ", result);
            if (!result || result.length === 0)
            {
                return {status:false, error:`${args['assetId']} does not exist`};
            } else {
                return {status:true, data:result.toString()};

            }
        }
    
    // deleteProject
    async  deleteProject(ctx, args)
    {
        let cid = new ClientIdentity(ctx.stub);        
        const owner = await cid.getAttributeValue('userId');
        console.info(`-------Delete function --- User Identity : ${owner} -------------`);

        args = JSON.parse(args);
        if(owner == args['owner']){

            await ctx.stub.deleteState(args['assetId']); // get the asset from chaincode state
           console.log("Project deleted");
           return {status:true, data:`Project deleted - ${args['assetId']}`};

        }else{
            return {status:false, message:'only owner can delete project!!'};
        }       
        
    }
        

    // queryAllAssetByOwner
    async queryAllProjectByOwner(ctx) {

        // const asset = {
        //     assetType:'investment',
        //     owner:userID,     
        //     flatPrice:flatPrice,
        //     projectId:projectId,
        //     projectName:projectName  
        // };

        let cid = new ClientIdentity(ctx.stub);
        const userID = await cid.getAttributeValue('userId');
        
        const type = 'project'; // 'project'
        const allResults = [];
        let queryString = {};
        queryString.selector = {};
        queryString.selector.assetType = type;
        queryString.selector.owner = userID;

        for await (const { key, value }
            of ctx.stub.getQueryResult(JSON.stringify(queryString))) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ assetId: key, record: record });
        }
        console.info(allResults);
        return {status:true, data:JSON.stringify(allResults)};
    }

 
    // queryAllAssets on ledger
    async queryAllAssets(ctx) {
                   
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }

        console.info(allResults);
        if (!allResults || allResults.length === 0)
            {
                return {status:false, error: `${args['assetID']} does not exist`};
            } else {
                return {status:true, assets:JSON.stringify(allResults)};
            }
    }

    
    //get history of project
    async getHistoryOfProject(ctx, args) {
       
        args = JSON.parse(args);

        for await (const {key, value} of ctx.stub.getHistoryForKey(args['projectId'])) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        
        if (!allResults || allResults.length === 0)
            {
                return {status:false, error: `${projectId} does not exist`};
            } else {
                return {status:true, assets:JSON.stringify(allResults)};
            }
    }
}

module.exports = DltContract;
