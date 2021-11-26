const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bldso.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('bicycles-Hub');
        const bikecollection = database.collection('bikes');
        const allreviews = database.collection('reviews');
        const customerCollection = database.collection('customers');
        const userCollection = database.collection('users');





        app.post('/bikes', async (req, res) => {
            const bike = req.body;
            const result = await bikecollection.insertOne(bike);
            res.json(result)

        })

        app.get('/bikes', async (req, res) => {

            const cursor = bikecollection.find({});
            const bikes = await cursor.toArray();
            res.send(bikes);
        })

        app.get('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const purchase = await bikecollection.findOne(query);
            res.json(purchase);
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await allreviews.insertOne(review);
            res.json(result);
        })

        app.get('/reviews', async (req, res) => {

            const cursor = allreviews.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })


        app.post('/customers', async (req, res) => {
            const customers = req.body;
            const result = await customerCollection.insertOne(customers);
            res.json(result);
        })
        app.get('/customers', async (req, res) => {

            const cursor = customerCollection.find({});
            const customer = await cursor.toArray();
            res.send(customer);
        });




        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.json(result);
        })


        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } }
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result)
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })




    }

    finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello bicycleHub')
})

app.listen(port, () => {
    console.log(`Example app listening ${port}`)
})