/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Chanwoong Park Student ID: 166686188 Date: 2022-09-16!
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
app.post("/api/movies", async (req,res)=>{
    
    try{
        let movie = await db.addNewMovie(req.body);
        res.status(201).json(movie);
    }
    catch(err){
        res.status(500).json({message: "Error: Request is failed!!"});
    }
});

//get movie with page & perPage
app.get("/api/movies", async (req,res)=>{
    
    try{
        let movie = await db.getAllMovies(req.query.page,req.query.perPage,req.query.title);
        res.status(200).json({movie});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }   
});

//get movie with id
app.get("/api/movies/:id", async (req,res)=>{

    try{
        let movie = await  db.getMovieById(req.params.id);
        if(movie){
            res.json(movie);
        }
        else{
            res.status(404).json({error: 'Not exist'});
        }
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
    
});

//update movie with id
app.put("/api/movies/:id", async (req,res)=>{

    try{
        let updateMovie = await db.updateMovieById(req.params.id, req.body);
        if(!updateMovie.modifiedCount){
            res.status(404).json({message: "Can not update!!"});
        }
        else{
            res.status(204).json({message: `name with id: ${req.params.id} updated`});
        }
    }
    catch(err){
        res.status(500).json({message: "Error: Unavailable movie Id!!"})
    }    
});

//delete movie with id
app.delete("/api/movies/:id", async (req,res)=>{

    try{
        let movie = await db.deleteMovieById(req.params.id, req.body);
        if(!movie.deletedCount){
            res.status(404).json({message: "Can not delete"});
        }
        else{
            res.status(204).json({message: `deleted name with id: ${req.params.id}`});
        }
    }
    catch(err){
        res.status(500).json({message: "Error: Unavailable movie Id!!"});
    }   
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
        app.listen(HTTP_PORT, ()=>{
            console.log(`server listening on: ${HTTP_PORT}`);
        });
    }).catch((err)=>{
        console.log(err);
    }
);