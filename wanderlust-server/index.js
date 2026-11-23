import express from "express";
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';
import cors from "cors";
import { createRemoteJWKSet, jwtVerify } from "jose";

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());


const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }

}

const mongoClient = await connectToMongoDB();

const db = mongoClient.db("wanderlust");
const destinationCollection = db.collection("destination");
const bookingCollection = db.collection("bookings");

const verifyToken = async (req, res, next) => {

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ msg: "Unauthorized!" });
  }

  const token = authHeader.split(" ")[1];
  
  if(!token){
    return res.status(401).send({msg: "Unauthorized!"});
  }

  const JWKS = createRemoteJWKSet(new URL(`${process.env.CLIENT_URL}/api/auth/jwks`));

  try{
    const { payload } = await jwtVerify(token, JWKS);
    next();
  } catch(error){
    return res.status(500).send({msg: "Server Error!"});
  }
};

app.get('/destinations', async (req, res) => {
  const result = await destinationCollection.find().toArray();
  res.send(result);
})

app.post('/add-destination', verifyToken, async (req, res) => {
  const data = req.body;

  const result = await destinationCollection.insertOne(data);

  res.send(result);
})

app.get('/destination/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const result = await destinationCollection.findOne({ _id: new ObjectId(id) });
  res.send(result);
})

app.get('/featured-destinations', async (req, res) => {
  const result = await destinationCollection.find().limit(5).toArray();
  res.send(result);
})

app.patch('/destination/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid destination id.' });
  }

  const { name, country, category, price, duration, departureDate, imageUrl, description } = req.body;
  const result = await destinationCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        name,
        country,
        category,
        price,
        duration,
        departureDate,
        imageUrl,
        description,
      },
    },
  );

  if (result.matchedCount === 0) {
    return res.status(404).send({ message: 'Destination not found.' });
  }

  res.send({ message: 'Destination updated successfully.' });
})

app.delete('/destination/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  const result = await destinationCollection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    return res.status(404).send({ message: 'Destination not found.' });
  }

  res.send({ message: 'Destination deleted successfully.' });
})

app.post('/bookings', async (req, res) => {
  const data = req.body;
  const result = await bookingCollection.insertOne(data);
  res.send(result);
})

app.get('/my-bookings/:email', verifyToken, async (req, res) => {
  const { email } = req.params;
  const result = await bookingCollection.find({ email: email }).toArray();
  res.send(result);
})

app.delete('/my-bookings/:id', async (req, res) => {
  const { id } = req.params;
  const result = await bookingCollection.deleteOne({ _id: id });
  res.send(result);
})

// app.patch('/destination/:id', async (req, res) => {
//   const { id } = req.params;
//   const updatedData = req.body;

//   const result = await destinationCollection.updateOne(
//     { _id: new ObjectId(id) },
//     { $set: updatedData }
//   );

//   res.json(result);
// });

app.get('/', (req, res) => {
  res.send({ message: 'Server is running!' });
})

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
})

export default app