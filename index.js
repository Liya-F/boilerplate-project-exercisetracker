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
app.post('/api/users',(req,res)=>{
  let user = {username:req.body.username, _id:users.length};
  users.push(user);
  res.json(user);
})

app.post('/api/users/:_id/exercises',(req,res)=>{
  console.log(req.body.description, req.body.duration, req.body.date);
  inputId = req.params._id;
  inputUsername = users[inputId].username;
  inputDescription = req.body.description;
  inputDuration = req.body.duration;
  inputDate = req.body.date;
  res.json({username:inputUsername, description:inputDescription, duration:inputDuration, date:inputDate, _id:inputId})
})

app.get('/api/users',(req,res)=>{
  res.json(users);
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
