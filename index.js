const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

const uri =process.env.URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// tab ---- 
app.get("/allToysByCategory/:text", async (req, res) => {
  console.log(req.params.text);
  if (req.params.text=='TRACTOR' || req.params.text=='racing' || req.params.text=='Dancing') {
      const result = await toyCollection.find({sub_category: req.params.text}).toArray();
      console.log(result);
       return res.send(result)    
  }
  const result = await toyCollection.find({}).toArray();
  res.send(result)
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const toyCollection = client.db("toycarDB").collection("toycollection");

    // step-1
    app.get("/toys", async (req, res) => {
      const cursor = toyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: { name:1, description:1,picture_url:1,available_quantity:1,rating:1,price:1,seller_name:1,name:1,seller_email:1}
      };
      const result = await toyCollection.findOne(query, options);
      res.send(result);
    });

// tab ---- 
    app.get("/allToysByCategory/:sub_category", async (req, res) => {
        console.log(req.params.id);
        const toys = await toyCollection
          .find({
            status: req.params.sub_category,
          })
          .toArray();
        res.send(toys);
      });
      


    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("car toy shop");
});

app.listen(port, () => {
  console.log(`Car shop running on PORT  ${port}`);
});