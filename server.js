const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

const PORT = 3001


app.use(express.static('public'))

app.use(express.json())

app.use(express.urlencoded({extended: true}))

// GET /notes should return the notes.html file.

app.get('/notes', (req, res) =>{
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

// GET * should return the index.html file.
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, '/public/index.html'))
})
// The following API routes should be created:

// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) throw err
        res.json(JSON.parse(data))
    })
})

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to giveeach note a unique id when it's saved (look into npm packages that could do this for you).

app.post('/api/notes', (req, res) => {
    if (req.body.title && req.body.text){
        let newId = 1
        const newCard = {title: req.body.title,
        text: req.body.text,
        id: newId}
        //newId ++
        fs.readFile('./db/db.json', 'utf-8', (err, data) =>{
            if(err) throw err
            const oldJson = JSON.parse(data)
            oldJson.push(newCard)
            let newJson = JSON.stringify(oldJson)
            fs.writeFile('./db/db.json', newJson, (err) => {
                if (err) throw err
                res.status(200)
            })       
        })
    }
    else{
        res.status(400)
    }
})


app.listen(PORT, ()  => {
    console.log('Server listening on http://localhost:' + PORT)
})

