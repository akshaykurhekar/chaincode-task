// database file for the application which uses mongoose to connect to the database
// mongoose schema = name,email,phonenumber,experience,bootcamp(string),coupon code(optional)

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const dbUri = process.env.MONGO_DB_URI;

// connect to the database
const connect = () => {
  return mongoose
    .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      const db = mongoose.connection;
      console.log("connected to database " + db.name);
    })
    .catch((e) => {
      console.error(e);
      throw e;
    });
};

// export the connect function
module.exports = connect;