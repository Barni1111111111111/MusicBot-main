const uri = process.env.MONGODB_URI;
const mongoose = require('mongoose')
//const { mongoPath } = require('./botconfig.json')
const mongoPath = 'mongodb+srv://barni:Barni@cluster0.iamfgy9.mongodb.net/?retryWrites=true&w=majority'
module.exports = async () => {
  mongoose.connect(mongoPath, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,

  })
}