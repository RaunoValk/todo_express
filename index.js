const express = require ('express')
const app = express()
const fs = require('node:fs');
const path= require("path")
app.use(express.urlencoded({ extended: true }));
app.set('view engine', "ejs")
app.set('views' , path.join(__dirname, 'views'))


const readFile = (filename) =>{
    return new Promise((resolve, reject) =>{
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
             const tasks =data.split("\n") 
              resolve(tasks)
              });
    })
    
    
    }


app.get('/', (req, res) =>  {
    readFile('./tasks')
    .then(tasks =>{ 
        res.render('index',{tasks: tasks})
    
    

    
    })
})
app.post('/', (req, res) =>  {
    console.log("Form sent data")
    let task = req.body.task
    
    readFile('./tasks')
    .then(tasks =>{ 
        tasks.push(task)
        const data= (tasks.join('\n'))
        fs.writeFile('./tasks', data, err => {
            if (err) {
              console.error(err);
            } else {
                res.redirect('/')           
             }
          })
    
    }) 
})


app.listen(3001, () => { 
    console.log('Example app is started at http://localhost:3001') 
})