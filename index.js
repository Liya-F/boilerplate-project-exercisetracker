const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
let users=[];
let log=[];
app.post('/api/users',(req,res)=>{
  let user = {username:req.body.username, _id:users.length};
  users.push(user);
  res.json(user);
})

app.post('/api/users/:_id/exercises',(req,res)=>{
  inputId = req.params._id;
  inputUsername = users[inputId].username;
  inputDescription = req.body.description;
  inputDuration = parseInt(req.body.duration);
  inputDate = new Date(req.body.date).toDateString();
  console.log(inputDate);
  let exercise = {description:inputDescription, duration:inputDuration, date:inputDate};
  log.push(exercise);
  res.json({username:inputUsername, description:inputDescription, duration:inputDuration, date:inputDate, _id:inputId})
})

app.get('/api/users',(req,res)=>{
  res.json(users);
})

app.get('/api/users/:_id/logs',(req,res)=>{
  const from = new Date(req.query.from); 
  const to = new Date(req.query.to); 
  const limit = parseInt(req.query.limit); 
  let filteredLogs = log;
  if (from) {
    filteredLogs = filteredLogs.filter((entry) => new Date(entry.date) >= from);
  }
  if (to) {
    filteredLogs = filteredLogs.filter((entry) => new Date(entry.date) <= to);
  }
  if (limit) {
    filteredLogs = filteredLogs.slice(0, limit);
  }

  res.json({username:inputUsername, count:filteredLogs.length, _id:inputId, log:filteredLogs});
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
