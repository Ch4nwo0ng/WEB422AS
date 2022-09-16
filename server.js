/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Chanwoong Park Student ID: 166686188 Date: 2022-09-16
* Cyclic Link: https://cyan-lively-snail.cyclic.app
*
********************************************************************************/ 
const express = require('express');
const cors = require('cors');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

require('dotenv').config();
app.use(cors());
app.use(express.json());

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

app.get("/",(req,res)=>{
    res.json({message: "API Listening"});
});

//add new movie
app.post("/api/movies", (req,res)=>{
    
    db.addNewMovie(req.body).then((data)=>{
        res.json(data);
        res.status(201).json({message: "new movie created"});
    }).catch(()=>{
        res.status(500).json({message: "Error: Request is failed!!"});
    });

});

//get movie with page & perPage
app.get("/api/movies", (req,res)=>{
    
    db.getAllMovies(req.query.page,req.query.perPage,req.query.title).then((data)=>{
        res.json(data);
    }).catch(err=>{
        res.status(500).json({message: err});
    });
   
});

//get movie with id
app.get("/api/movies/:id", (req,res)=>{
    db.getMovieById(req.params.id).then((data)=>{
        res.json(data);
    }).catch(()=>{
        res.status(500).json({message: "Error: Unavailable movie Id!!"});
    });
});

//update movie with id
app.put("/api/movies/:id", (req,res)=>{
    db.updateMovieById(req.params.id, req.body).then((data)=>{
        res.json(data);
        res.status(204).json({message: `name with id: ${req.params.id} updated`});       
    }).catch(()=>{
        res.status(500).json({message: "Error: Unavailable movie Id!!"});
    });
});

//delete movie with id
app.delete("/api/movies/:id", (req,res)=>{
    db.deleteMovieById(req.params.id, req.body).then(()=>{
        res.json({message: `deleted name with id: ${req.params.id}`});
    }).catch(()=>{
        res.status(500).json({message: "Error: Unavailable movie Id!!"});
    });
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
        app.listen(HTTP_PORT, ()=>{
            console.log(`server listening on: ${HTTP_PORT}`);
        });
    }).catch((err)=>{
        console.log(err);
    }
);