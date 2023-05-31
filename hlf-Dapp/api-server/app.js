'use strict';

const express = require('express');
const helper = require('./helper');
const invoke = require('./invoke');
const query = require('./query');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
let server = app.listen(5000, function () {
    console.log('Node server is running on 5000 port :) ');
});


app.post('/registerUser', async function (req, res, next) {
    try {
        let userId, customRole, orgID;

        // check request body
        console.log("Received request: ", req.body);
        if (req.body.userId && req.body.role) {
            userId = req.body.userId;
            
            customRole = req.body.role;
        } else {
            console.log("Missing input data. Please enter all the user details.");
            throw new Error("Missing input data. Please enter all the user details.");
        }
        orgID = req.body.orgID ? req.body.orgID : 'Org1';

        //call registerEnrollUser function and pass the above as parameters to the function
        const result = await helper.registerUser(userId, customRole);
        console.log("Result from user registration function:", result);

        // check register function response and set API response accordingly 
        res.status(200).send(result);
    } catch (error) {
        console.log("There was an error while registering the user. Error is ", error);
        next(error);
    }  
});

app.post('/userLogin', async function (req, res, next){
    try {
        let userId, orgID;

        // check request body
        
        if (req.body.userId) {
            userId = req.body.userId;
            
        } else {
            console.log("Missing input data. Please enter all the user details.");
            throw new Error("Missing input data. Please enter all the user details.");
        }
        orgID = req.body.orgID ? req.body.orgID : 'Org1';

        const result = await helper.login(userId, orgID);
        console.log("Result from user login function: ", result);
        //check response returned by login function and set API response accordingly
        res.status(200).send(result);
    } catch (error) {
        console.log("There was an error while logging in. Error is ", error);
        next(error);
    }

});

app.post('/createProject', async function (req, res, next){
    try {
        // projectId, projectName, description,  flatPrice
        let userId = req.body.userId;
        const key = Date.now();
        const projectId = `${userId}_${key}`; // generate id with timestamp
        const project = {  
            assetType:'project',           
            projectName:req.body.projectName,
            description: req.body.description,
            flatPrice : req.body.flatPrice,
            owner:userId,
            timestamp: Date.now()
        }

        const result = await invoke.invokeTransaction('createProject',{projectId:projectId, project:project, owner:userId},userId);
        // const result = await helper.createProject(projectId, projectName, description, flatCount, flatPrice);
        console.log("create Asset status: ", result);
        //check response returned by login function and set API response accordingly
        res.status(200).send(result);

    } catch (error) {       
        next(error);
    }
});

app.post('/updateProject', async function (req, res, next){
    try {
        //  updateProject(ctx, oldProjectId, projectName, description, flatCount, flatPrice)
      
        let userId = req.body.userId;
        let projectId = req.body.projectId; 
        const project = {    
            assetType:'project',           
            projectName:req.body.projectName,
            description: req.body.description,
            flatPrice : req.body.flatPrice,
            owner:req.body.userId,
            timestamp: req.body.timestamp
        }

       const result = await invoke.invokeTransaction('updateProject',{projectId:projectId, project:project},userId);
        // const result = await helper.updateProject(projectId, projectName, description, flatCount, flatPrice);
        console.log("update Asset status: ", result);
        //check response returned by login function and set API response accordingly
        res.status(200).send(result);

    } catch (error) {       
        next(error);
    }
});

app.post('/deleteProject', async function (req, res, next){
    try {
              
        let userId = req.body.userId;
        let projectId = req.body.projectId;         

       const result = await invoke.invokeTransaction('deleteProject',{assetId:projectId},userId);
       
        console.log(" Asset status: ", result);
        //check response returned by login function and set API response accordingly
        res.status(200).send(result);

    } catch (error) {       
        next(error);
    }
});

app.post('/queryProject', async function (req, res, next){
    try {
        //  queryAssetById(ctx, projectId)
        let userId = req.body.userId;
        let projectId = req.body.projectId;
        // const result = await helper.queryProject(projectId);
        const result = await query.getQuery('queryAssetById',{assetId:projectId}, userId);
        console.log("Asset data: ", result);
        //check response returned by login function and set API response accordingly
        res.status(200).send(JSON.parse(result.data));
    } catch (error) {       
        next(error);
    }
});


app.post('/queryAllProjects', async function (req, res, next){
    try {
        // queryAllProjects(ctx)
        let userId = req.body.userId;        
        // const result = await helper.queryAllProjects();
        const result = await query.getQuery('queryAllProjects',{}, userId);

        console.log("Asset data: ", result);
        //check response returned by login function and set API response accordingly
        if(result.status){

            res.status(200).send(JSON.parse(result.data));
        }else{
            res.status(200).send(JSON.parse(result.message));

        }

    } catch (error) {       
        next(error);
    }
});

// query Ledger
app.post('/queryLedger', async function (req, res, next){
    try {
        // queryAllAssets(ctx)
        let userId = req.body.userId;  
        const result = await query.getQuery('queryAllAssets',{}, userId);

        console.log("Asset data: ", result);
        //check response returned by login function and set API response accordingly
        if(result.status){

            res.status(200).send(JSON.parse(result.assets));
        }else{
            res.status(200).send(JSON.parse(result.error));

        }

    } catch (error) {       
        next(error);
    }
});

app.use((err, req, res, next) => {
    res.status(400).send(err.message);
})