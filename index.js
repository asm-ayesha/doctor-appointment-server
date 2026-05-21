const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dns = require("dns");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { verify } = require("crypto");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");

dotenv.config();

dns.setDefaultResultOrder("ipv4first");

const app = express();
const port = process.env.PORT || 5000;

const uri = process.env.MONGODB_URI;



const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
)




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


const logger = (req, res, next) => {
  console.log(`${req.method} | ${req.url} `)
  next();

}


// const verifyToken = async (req, res, next) => {
//   const { authorization } = req.headers
//   // console.log(req.headers, 'from verify token')
//   const token = authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorize' })
//   }

//   try {
//     // const JWKS = createRemoteJWKSet(
//     //   new URL('http://localhost:3000/api/auth/jwks')
//     // )
//     const { payload } = await jwtVerify(token, JWKS)
//     req.user = payload;


//     next()
//   } catch (error) {
//     console.error('Token validation failed:', error)
//     return res.status(401).json({ message: 'Unauthorize' })
//   }
// }




const verifyToken = async (req, res, next) => {
  const authorization = req.headers.authorization || req.headers.Authorization;
  
  const token = authorization?.split(" ")[1];

  if (!token) {
    // console.log(" No token found in authorization header");
    return res.status(401).json({ message: 'Unauthorized: Missing Token' });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS);
    req.user = payload;
    
    next();
  } catch (error) {
   
    // console.error(' Token validation failed:', error.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid Token' });
  }
};























async function run() {
  try {
    await client.connect();

    const db = client.db("doctor-appoinment");
    const doctorCollection = db.collection("doctors");
    const appointmentCollection = db.collection("appointments");


    // ✅ Get all doctors
    app.get("/doctors", async (req, res) => {
      const { search } = req.query;

      let cursor;
      if (search) {
        // cursor = doctorCollection.find({name: {$regex: search, $options: "i"}});
        cursor = doctorCollection.find({
          $or: [
            {
              name: {
                $regex: search,
                $options: "i",
              },
            },
            {
              specialty: {
                $regex: search,
                $options: "i",
              },
            }
          ]
        });

      } else {
        cursor = doctorCollection.find();
      }


      const result = await cursor.toArray();
      res.send(result);
    });

    //  Get single doctor
    app.get("/doctors/:doctorId", logger, async (req, res) => {
      const doctorId = req.params.doctorId;
      const query = {
        _id: new ObjectId(doctorId),
      };
      const result = await doctorCollection.findOne(query);

      res.send(result);
    });



  // post appointment
  app.post("/appointments", async(req, res) =>{ 
      const bookingData = req.body;
      const result = await appointmentCollection.insertOne(bookingData);

      res.send(result)
    
  })


  // get bookings by user email
    app.get("/my-bookings", async (req, res) => {
      try {
        const email = req.query.email;
        const query = { userEmail: email };
        const result = await appointmentCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send([]);
      }
    });


    //  Delete appointment by ID
    app.delete("/appointments/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await appointmentCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to delete" });
      }
    });



    //  Update appointment by ID
    app.put("/appointments/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedData = req.body;
        const query = { _id: new ObjectId(id) };
        
        const updateDoc = {
          $set: {
            patientName: updatedData.patientName,
            gender: updatedData.gender,
            phone: updatedData.phone,
            date: updatedData.date,
            time: updatedData.time,
            reason: updatedData.reason
          }
        };

        const result = await appointmentCollection.updateOne(query, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to update" });
      }
    });







    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
}

run();

app.get("/", (req, res) => {
  res.json({ message: "Server running" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});