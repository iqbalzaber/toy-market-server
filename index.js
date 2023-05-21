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
  
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
   
    const toyCollection = client.db("toycarDB").collection("toycollection");
      const orderCollection = client.db("toycarDB").collection("orderCollection"); 
   
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
        projection: {
          name: 1,
          description: 1,
          picture_url: 1,
          available_quantity: 1,
          rating: 1,
          price: 1,
          seller_name: 1,
          name: 1,
          seller_email: 1,
        },
      };
      const result = await toyCollection.findOne(query, options);
      res.send(result);
    });

    // search ar
// const indexKey = {toyName:1};
// const indexOption = {name:'toyName'}
// const result = await toyCollection.createIndex(indexKey,indexOption) 

    app.get("/allToySearch/:text", async (req, res) => {
      console.log(req.params.text);
      const searchText = req.params.text;
      try {
        const result = await toyCollection.find({
          name: {
            $regex: searchText,
            $options: "i"
          }
        }).toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while searching for toys.");
      }
    });
    // tab ----

    app.get("/allToysByCategory/:text", async (req, res) => {
      console.log(req.params.text);
      if (
        req.params.text == "TRACTOR" ||
        req.params.text == "racing" ||
        req.params.text == "dancing"
      ) {
        const result = await toyCollection
          .find({ sub_category: req.params.text })
          .toArray();
        console.log(result);
        return res.send(result);
      }
      const result = await toyCollection.find({}).toArray();
      res.send(result);
    });

    // show data in input field ar jinish pati
    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: {
          name: 1,
          description: 1,
          picture_url: 1,
          available_quantity: 1,
          rating: 1,
          price: 1,
          seller_name: 1,
          name: 1,
          seller_email: 1,
        },
      };

      const result = await toyCollection.findOne(query, options);
      res.send(result);
    });

    // post a new toy
    app.post("/toys", async (req, res) => {
      const addNew = req.body;
      console.log(addNew);
      const result = await toyCollection.insertOne(addNew);
      res.send(result);
    });

    // post data in order
    app.post("/order", async (req, res) => {
      const order = req.body;
      console.log(order);
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    app.get("/order", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }

      const result = await orderCollection.find(query).toArray();

      res.send(result);
    });

    app.get("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await orderCollection.findOne(query);
      res.send(result);
    });

    app.put("/order/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const update = req.body;
      const order = {
        $set: {
          price: update.price,
          quantity: update.quantity,
          details: update.details,
        },
      };
      const result = await orderCollection.updateOne(filter, order, option);
      res.send(result);
    });

    // delete by id -
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
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
  res.send("babe toy shop");
});

app.listen(port, () => {
  console.log(`Babe toy shop running on PORT  ${port}`);
});