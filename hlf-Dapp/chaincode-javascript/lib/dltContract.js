/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const { Contract } = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity;

class DltContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        // const assets = [
        //     {
        //         assetType:'project',
        //         projectName:'Radha Krishna Apartment',
        //         flatPrice:5000,
        //         description:'only 3BKH flats available'       
        //     },
        //     {
        //         assetType:'project',
        //         projectName:'Sita Ram Apartment',
        //         flatPrice:2000,
        //         description:'only 3BKH flats available'       
        //     },
        //     {
        //         assetType:'project',
        //         projectName:'Mahavira Apartment',
        //         flatPrice:4500,
        //         description:'only 3BKH flats available'       
        //     },
        //     {
        //         assetType:'project',
        //         projectName:'Radhay Complex',
        //         flatPrice:4000,
        //         description:'only 3BKH flats available'       
        //     },
        // ];

        // for (let i = 0; i < assets.length; i++) {
        //     assets[i].assetType = 'project';
        //     await ctx.stub.putState('Project' + i, Buffer.from(JSON.stringify(assets[i])));
        //     console.info('Added <--> ', assets[i]);
        // }
        console.info('============= END : Initialize Ledger ===========');
    }

    
    // create project
    async createProject(ctx, args) {
             
                
        args = JSON.parse(args);
        console.log("args: ", args);
        
        console.info(`============= START : Create Project by owner : ${args['owner']} ===========`);

        await ctx.stub.putState(args['projectId'], Buffer.from(JSON.stringify(args['project'])));
        console.info('============= END : Create Project ===========');
        return {status:true, message:'Project created success'};
      
    }

     // update project
     async updateProject(ctx, args) {
        let cid = new ClientIdentity(ctx.stub);        
        const owner = await cid.getAttributeValue('userId');
        console.info(`User Identity : ${owner}`)
        args = JSON.parse(args);
        console.log("args: ", args);

        if(owner === args["owner"]){
            console.info(`============= START : update Project by ${args['owner']} ===========`);

            // owner can update asset with in 5mins // 5*60,000 = 300000 in millisecond
            const result = await ctx.stub.getState(args['projectId']);
            const oldData = JSON.parse(result.toString());
            const currentTime = Date.now();
            const assetTimestamp = oldData.timestamp;

            if(currentTime - assetTimestamp <= (300000)){
                
                await ctx.stub.putState(args['projectId'], Buffer.from(JSON.stringify(args['project'])));
                console.info('============= END : update Project ===========');
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
        args = JSON.parse(args);
         await ctx.stub.deleteState(args['assetId']); // get the asset from chaincode state
        console.log("Project deleted");
       
            return {status:true, data:`Project deleted - ${args['assetId']}`};
        
    }
        

    // // queryAllAssetByUser
    // async queryAllAssetByUser(ctx) {

    //     // const investmentAsset = {
    //     //     assetType:'investment',
    //     //     userID:userID,     
    //     //     flatPrice:flatPrice,
    //     //     projectId:projectId,
    //     //     projectName:projectName  
    //     // };

    //     let cid = new ClientIdentity(ctx.stub);
    //     const userID = await cid.getAttributeValue('userId');
        
    //     const type = 'investment'; // 'project', 'wallet', 'investment'
    //     const allResults = [];
    //     let queryString = {};
    //     queryString.selector = {};
    //     queryString.selector.assetType = type;
    //     queryString.selector.userID = userID;

    //     for await (const { key, value }
    //         of ctx.stub.getQueryResult(JSON.stringify(queryString))) {
    //         const strValue = Buffer.from(value).toString('utf8');
    //         let record;
    //         try {
    //             record = JSON.parse(strValue);
    //         } catch (err) {
    //             console.log(err);
    //             record = strValue;
    //         }
    //         allResults.push({ assetId: key, record: record });
    //     }
    //     console.info(allResults);
    //     return {status:true, data:JSON.stringify(allResults)};
    // }

 
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
    async getHistoryOfProject(ctx, projectId) {
       
        for await (const {key, value} of ctx.stub.getHistoryForKey(projectId)) {
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
