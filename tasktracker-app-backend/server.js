const express=require('express');
const app=express();
const cors=require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('./users.js');
const PORT = 5000;
const JWT_SECRET = 'mysecretkey123'; //Hardcoded JWT secret for now
app.use(cors());
app.use(express.json());

//ststuc task data
//task datatype is aarray of objects
let tasks=[
    {id: 1, text:"learn React", completed:false},
    {id:2, text:"Build Express API", completed:false}
   
];
//backend helath check
/// is  aindex place
app.get('/', (req,res)=>{
    res.send('Hello from Express backend, Backend is up and running!');
});

//Get all tasks

app.get('/api/tasks', (req,res)=>{
    res.json(tasks);
});

//POst new task
app.post('/api/tasks', (req,res) =>{
   console.log(req);
   const newTask={
    id: tasks.length + 1,
    text: req.body.text,
    completed:false

   };
   tasks.push(newTask);
   res.status(201).json(newTask);
});

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  //find function can only be use in array
  const user = users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Wrong email or password' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: '15m',
  });

  res.json({ token, message: 'Login successful' });
});