const express = require("express");
const app = express();
const {MongoClient} = require("mongodb");
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

// Middleware
const cors = require("cors");
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r3srk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("Where-To-Go");
    const useServicesCollection = database.collection("Services");
    const useOrdersCollection = database.collection("Orders");

    // Get All Services
    app.get("/all-services", async (req, res) => {
      const services = await useServicesCollection.find({}).toArray();
      res.send(services);
    });

    // // // Service DETAILS
    app.get("/service-details/:id", async (req, res) => {
      const ID = req.params.id;
      const service = {_id: ObjectId(ID)};
      const ServicelDetails = await useServicesCollection.findOne(service);
      res.send(ServicelDetails);
    });

    app.get("/allorder", async (req, res) => {
      const orderData = await useOrdersCollection.find({}).toArray();
      res.json(orderData);
    });

    app.post("/add-service", async (req, res) => {
      const serviceData = await useServicesCollection.insertOne(req.body);
      res.json(serviceData);
    });

    app.delete("/delete-order/:id", async (req, res) => {
      const orderId = req.params.id;
      const order = {_id: ObjectId(orderId)};
      const result = await useOrdersCollection.deleteOne(order);
      res.json(result);
    });

    //UPDATE status code
    app.put("/order-update/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const options = {upsert: true};
      const updateDoc = {
        $set: {
          status: req.body.status,
        },
      };
      const result = await useOrdersCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.json(result);
    });

    //POST Data
    app.post("/add-order", async (req, res) => {
      console.log(req.body);
      const orderData = await useOrdersCollection.insertOne(req.body);
      res.json(orderData);
    });

    app.get("/allorder", async (req, res) => {
      const orderData = await useOrdersCollection.find({}).toArray();
      res.json(orderData);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Where To Go is Running");
});

app.listen(port, () => {
  console.log("Where To Go Server on Port ", port);
});
