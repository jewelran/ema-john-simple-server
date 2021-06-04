const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 5000
app.use(cors());
app.use(bodyParser.json())
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ckgfu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("onlineShopingStore").collection("productStore");
  const ordersCollection = client.db("onlineShopingStore").collection("orderStore");
  app.post('/addProduct',(req, res) =>{
      const products = req.body;
        productCollection.insertMany(products)
        .then(result => {
            // console.log(result.insertedCount);
            res.send(result.insertedCount)
        })
  })
// for load all product
  app.get('/products',(req, res) => {
      productCollection.find({})
      .toArray((err, documents)=> {
          res.send(documents)
      })

  })


// for load single product
  app.get('/product/:key',(req, res) => {
    productCollection.find({key: req.params.key})
    .toArray((err, documents)=> {
        res.send(documents[0])
    })

})


// product post 
app.post('/productByKeys', (req, res) => {
  const productsKey = req.body
  productCollection.find({key: {$in : productsKey}})
  .toArray((err, documents) => {
    res.send(documents)
  })
})
// for data saved in mongodb atlas collection............... 
app.post('/addOrder',(req, res) =>{
  const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
        // console.log(result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})

  console.log("data base connected");
});



app.get('/', (req, res) => {
  res.send('Hello World i am here , i am waiting for you')
})
app.listen(
  port
)