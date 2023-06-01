// Model for the Event

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create a schema
const eventSchema = new Schema({
  eventName: { type: String, required: true },
  userName: { type: String, },
  assetData: { type: {
      assetType:String,
      projectName:String, 
      description:String, 
      flatPrice:String,
      owner:String,      
      timestamp:Number     
  }},
  transactionId: { type: String, required: true },
  blockNumber: { type: String, required: true },
  
});

// create a model
const Event = mongoose.model("UserModel", eventSchema);

// export the model
module.exports = Event;