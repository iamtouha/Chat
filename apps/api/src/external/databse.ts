import { MongoClient, ServerApiVersion } from 'mongodb';
export { ObjectId } from 'mongodb';

const mongoUrl = process.env.MONGO_URL!;

export const client = new MongoClient(mongoUrl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
export const userCollection = client.db('ClientProjects').collection('user');
export const orderCollection = client.db('ClientProjects').collection('order');
export const bankCollection = client.db('ClientProjects').collection('Bank');
export const filesCollection = client.db('ClientProjects').collection('files');
export const ContactCollection = client
  .db('ClientProjects')
  .collection('contact');
