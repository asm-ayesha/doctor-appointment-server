const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dns = require("dns");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();

dns.setDefaultResultOrder("ipv4first");

const app = express();
const port = process.env.PORT || 5000;

const uri = process.env.DB_URI;

// ✅ Middleware
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("doctor-appoinment");
    const doctorCollection = db.collection("doctors");

    // ✅ Get all doctors
    app.get("/doctors", async (req, res) => {
      const result = await doctorCollection.find().toArray();
      res.send(result);
    });

    // ✅ Get single doctor
    app.get("/doctors/:doctorId", async (req, res) => {
      const doctorId = req.params.doctorId;

      const query = {
        _id: new ObjectId(doctorId),
      };

      const result = await doctorCollection.findOne(query);

      res.send(result);
    });

    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
}

run();

app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});