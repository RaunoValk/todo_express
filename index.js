const express = require ('express')
const app = express()
const fs = require('node:fs');
const { stringify } = require('node:querystring');
const path= require("path")
app.use(express.urlencoded({ extended: true }));
app.set('view engine', "ejs")
app.set('views' , path.join(__dirname, 'views'))

/* Function readFile*/
const readFile = (filename) =>{
    return new Promise((resolve, reject) =>{
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
             const tasks = JSON.parse(data) 
              resolve(tasks)
        });
    })
}
/* Function writeFile */
const writeFile = (filename, data) =>{
    return new Promise((resolve, reject) =>{
        fs.writeFile(filename, data, 'utf8', err => {
            if (err) {
              console.error(err);
              return;
            } 
              resolve(true)
        });
    })
} 

app.get('/', (req, res) =>  {
    readFile('./tasks.json')
    .then(tasks =>{ 
        res.render('index',{
            tasks: tasks, 
            error: null
        })
    })
})
app.post('/', (req, res) =>  {
    console.log("Form sent data")
    let task = req.body.task
    let error = null
    if(task.trim().length == 0){
        error = "Sisesta andmed"
            readFile('./tasks.json')
                .then(tasks =>{ 
                    res.render('index',{
                        tasks: tasks,  
                        error: error
        }) 
    })
} else { 
    readFile('./tasks.json')
    .then(tasks =>{ 
        let index
        if(tasks.length === 0)
        {
            index = 0
        } else {
            index = tasks[tasks.length-1].id + 1; 
        } 
        const newTask ={
            "id" : index,
            "task" : req.body.task
        } 
        tasks.push(newTask)
        const data = JSON.stringify(tasks, null, 2)
        writeFile('./tasks.json', data)
              res.redirect('/')
             })
            }
         })
/* DELETE TASK */
app.get ('/delete-task/:taskId', (req,res)=>{
    let deletedTaskId = parseInt(req.params.taskId)
    readFile('./tasks.json')
    .then(tasks =>{
        tasks.forEach((task, index) => {
            if(task.id === deletedTaskId) {
                tasks.splice(index, 1)
            }    
        })
        const data = JSON.stringify(tasks, null, 2)
       writeFile('./tasks.json', data)
             res.redirect('/')
            })
        })
/* CLEAR ALL */
app.get ('/delete-tasks', (req,res)=>{
            const data = JSON.stringify([])
               writeFile('./tasks.json', data)
                     res.redirect('/')
}) 

/* UPDATE TASK */

app.get ('/update-task/:taskId', (req,res)=>{
    let updateTaskId = parseInt(req.params.taskId)
    readFile('./tasks.json')
    .then(tasks =>{
        let updateTask
        tasks.forEach((task) => {
            if(task.id === updateTaskId) {
                updateTask = (task.task)
            }
        })
        res.render('update.ejs' ,{
            updateTask: updateTask,
            updateTaskId: updateTaskId,
            error: null
            


            })
        })
    })
app.post('/update-task', (req, res) => {
    let updateTaskId = parseInt(req.body.taskId)
    let updateTask = req.body.task
    console.log('Received request to update task:', { updateTaskId, updateTask });

    
    if(updateTask.trim().length === 0){ 
        error = 'Sisesta andmed'
        res.render('update.ejs', {
            updateTask: updateTask,
            updateTaskId: updateTaskId,
            error: error
        })
    } else {
        readFile('./tasks.json')
        .then(tasks => {
            tasks.forEach((task, index) => {
                if(task.id === updateTaskId){
                    tasks[index].task = updateTask
                }
            })
            console.log(updateTask)
            const data = JSON.stringify(tasks, null, 2)
            writeFile('./tasks.json', data)
            res.redirect('/')
        })
    }

}) 

                


app.listen(3001, () => { 
    console.log('Example app is started at http://localhost:3001') 
})