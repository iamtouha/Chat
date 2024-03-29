import { Router } from 'express';
import { upload } from './uploader.js';
import {
  ContactCollection,
  ObjectId,
  bankCollection,
  orderCollection,
  userCollection,
} from './databse.js';

const router = Router();

type S3File = Express.Multer.File & { location: string; key: string };

router.post('/clear', async (req, res) => {
  const collection = await ContactCollection.deleteMany({});
  res.send(collection);
});

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ status: 'error', message: 'No file provided' });
  }
  const { location, mimetype, key, originalname, size } = req.file as S3File;
  return res.json({
    status: 'success',
    result: { url: location, mimetype, key, originalname, size },
  });
});

router.post('/test', (req, res) => {
  console.log(req.headers);
  res.send('ok');
});

router.post('/ContactData', async (req, res) => {
  let contact = req.body;
  let result = await ContactCollection.insertOne(contact);
  res.send(result);
});

//get contact info
router.get('/contact', async (req, res) => {
  let result = await ContactCollection.find().toArray();
  res.send(result);
});

router.post('/BankData', async (req, res) => {
  let Bank = req.body;
  let result = await bankCollection.insertOne(Bank);
  res.send(result);
});

//get bank info
router.get('/bank', async (req, res) => {
  let result = await bankCollection.find().toArray();
  res.send(result);
});

// all user get

router.get('/users', async (req, res) => {
  let result = await userCollection.find().toArray();
  res.send(result);
});

//     // user data add mongo db
router.post('/users', async (req, res) => {
  let user = req.body;

  let query = { email: user.email };
  let existingUser = await userCollection.findOne(query);
  if (existingUser) {
    return res.send({ message: 'Already existing user' });
  }

  let result = await userCollection.insertOne(user);
  res.send(result);
});

//     // // check user role show Dashboard _________________________________________
router.patch('/usersAdmin/:id', async (req, res) => {
  let id = req.params.id;
  let filter = { _id: new ObjectId(id) };
  let updateDoc = {
    $set: {
      role: 'admin',
    },
  };

  let result = await userCollection.updateOne(filter, updateDoc);
  res.send(result);
});

router.get('/userRoleCheck/:email', async (req, res) => {
  let email = req.params.email;
  let query = { email: email };
  let result = await userCollection.findOne(query);
  res.send(result);
});

router.delete('/usersDelete/:id', async (req, res) => {
  let deleteId = req.params.id;
  let query = { _id: new ObjectId(deleteId) };
  let result = await userCollection.deleteOne(query);
  res.send(result);
});

//    // // check user role show Dashboard _________________________________________

router.post('/orderData', async (req, res) => {
  let order = req.body;
  console.log(order);
  let result = await orderCollection.insertOne(order);
  res.send(result);
});

router.get('/allOrderData', async (req, res) => {
  let result = await orderCollection.find().toArray();
  res.send(result);
});

router.delete('/OrderDelete/:id', async (req, res) => {
  let orderID = req.params.id;
  let query = { _id: new ObjectId(orderID) };
  let result = await orderCollection.deleteOne(query);
  res.send(result);
});

// // ------------------------------------------------------

router.put('/profileUpdate/:id', async (req, res) => {
  let id = req.params.id;
  let upData = req.body;

  console.log(id, upData);

  let filter = { _id: new ObjectId(id) };
  let option = { upsert: true };
  let updateProfile = {
    $set: {
      name: upData.nameValue,
      title: upData.titleValue,
      bio: upData.bioValue,
    },
  };
  let result = await userCollection.updateOne(filter, updateProfile, option);
  // console.log(result)
  res.send(result);
});

export default router;
