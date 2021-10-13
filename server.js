const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3001 
let newId = 1

app.use(express.static('public'))

app.use(express.json())

app.use(express.urlencoded({extended: true}))



app.get('/notes', (req, res) =>{
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})


app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) throw err
        res.json(JSON.parse(data))
    })
})


app.post('/api/notes', (req, res) => {
    if (req.body.title && req.body.text){
        
        const newCard = {title: req.body.title,
        text: req.body.text,
        id: newId}
        newId ++
        fs.readFile('./db/db.json', 'utf-8', (err, data) =>{
            if(err) throw err
            const oldJson = JSON.parse(data)
            oldJson.push(newCard)
            let newJson = JSON.stringify(oldJson)
            fs.writeFile('./db/db.json', newJson, (err) => {
                if (err) throw err
                res.status(200).send('Succesfully sent')
            })       
        })
    }
    else{
        res.status(400).send('negative')
    }
})

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) throw err
        const oldData = JSON.parse(data)
        const theId = req.params.id
        const theRealJson = oldData.filter(note =>{
            if (note.id != theId){
                return true
                
            }
            else{
                return false
            }
        })
        let strJson = JSON.stringify(theRealJson)
        fs.writeFile('./db/db.json', strJson, (err) => {
            if (err) throw err
            res.status(200).send('successfully destroyed')
        })
    })
})

app.listen(PORT, ()  => {
    console.log('Server listening on http://localhost:' + PORT)
})