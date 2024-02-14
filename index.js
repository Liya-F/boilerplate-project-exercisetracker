const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const mongoose =  require('mongoose');
const cors = require('cors');
const ObjectId = require('mongoose').Types.ObjectId;
require('dotenv').config()
app.use(bodyParser.urlencoded({ extended: true })); 


app.use(cors())
app.use(express.static('public'))

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;

db.once('open', () => {
  console.log('Successfully connected to the database!');
});

db.on('error', (error) => {
  console.error('Connection error:', error);
});

const userSchema = new mongoose.Schema({
  username:String, 
})
const User = mongoose.model("User", userSchema);

const exerciseSchema = new mongoose.Schema({
  user_id:{type: String, required: true},
  description: String,
  duration: Number,
  date: Date
})

let Exercise = mongoose.model('Exercise',exerciseSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async(req, res) => {
  const userObj = new User({
    username : req.body.username
  });
  try {
    const user = await userObj.save()
    console.log(user);
    res.json(userObj);
  } catch (err) {
    console.error('Failed to save user:', err);
  }
})

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}).select("_id username");
    res.json(users);
  } catch (err) {
    console.error('Failed to fetch users:', err);
  }
});

app.post('/api/users/:id/exercises', async(req, res) => {
  const id = req.params.id;
  const { description, duration, date } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.send("couldn't find user")
    }else{
      const exerciseObj = new Exercise({
        user_id:user._id,
        description,
        duration,
        date:date ? new Date(date).toDateString() : new Date().toDateString()
      })
      const exercise = await exerciseObj.save()
      res.json({
        _id:user._id,
        username:user.username,
        description:exercise.description,
        duration:exercise.duration,
        date:new Date(exercise.date).toDateString()
      })
    }
  } catch (err) {
    console.log('Failed to save exercise:', err);
  }
})

app.get('/api/users/:id/logs', async (req, res) => {
  const id = req.params.id;
  const {from, to, limit} = req.query;
  const user = await User.findById(id);
  if (!user) {
    res.send("Could not find user")
    return;
  }
  let dateObj = {};
  if(from){
    dateObj["$gte"] = new Date(from)
  }
  if(to){
    dateObj["$lte"] = new Date(to)
  }
  let filter = {user_id:id}
  if(from || to ){
    filter.date = dateObj;
  }
  const exercises = await Exercise.find(filter).limit(+limit ?? 500)
  const log = exercises.map(e=>({
    description: e.description,
    duration: e.duration,
    date: e.date.toDateString()
  }))
  res.json({
    username:user.username,
    count:exercises.length,
    _id:user._id,
    log

  })


  
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


