projectData = {};

const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('website'));

app.get('/projectData', (req, res) => {
  // Send projectData as response
  res.status(200).send(projectData);
});

app.post('/add', (req, res) => {
  // saving the data in the variable
  let new_data = {
    date: req.body.date,
    temp: req.body.temp,
    content: req.body.content 
  }  

  projectData[Date.now().toString()] = new_data;

  res.status(200).send({
    sucess: true,
    message: "Stored",
    data: projectData
  });
})

const port = 8000;
const hostname = 'localhost';
const server = http.createServer(app);
server.listen(port, hostname, () => { console.log(`Running on http://${hostname}:${port}`); } )