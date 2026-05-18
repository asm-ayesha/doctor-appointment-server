const express = require('express');
const dotenv = require('dotenv');
const dns = require('dns');
const { MongoClient, ServerApiVersion } = require('mongodb');

dotenv.config();

dns.setDefaultResultOrder("ipv4first");

const app = express();
const port = 5000;

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World! hellow');
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});