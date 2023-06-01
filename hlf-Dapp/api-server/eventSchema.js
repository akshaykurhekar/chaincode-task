// Model for the Event

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create a schema
const eventSchema = new Schema({
  eventName: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  asset: { type: {
      assetType:String,
      projectId:String,
      projectName:String,  
      flatPrice:String,
      owner:String,     
  }, required: true },
  transactionId: { type: String, required: true },
  blockNumber: { type: String, required: true },
  
});

// create a model
const Event = mongoose.model("UserModel", eventSchema);

// export the model
module.exports = Event;