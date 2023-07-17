const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://dharinisrinivasan94:dharini123@cluster0.onzsztn.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Create movie schema and model
const movieSchema = new mongoose.Schema({
    name: String
});
const Movie = mongoose.model('Movie', movieSchema);



app.get('/', (req, res) => {
    res.send('Welcome to the Movie API!');
});

// POST /add-movie
app.post('/add-movie', async (req, res) => {
    const movie = new Movie({ name: req.body.name });
    await movie.save();
    res.send(movie);
});

// GET /get-all
app.get('/get-all', async (req, res) => {
    const movies = await Movie.find();
    res.send(movies);
});

// GET /get-single?id={id}
app.get('/get-single', async (req, res) => {
    const movie = await Movie.findById(req.query.id);
    if (!movie) return res.status(404).send('Movie not found');
    res.send(movie);
});

// GET /get-paginated?page={page}&size={size}
app.get('/get-paginated', async (req, res) => {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
    const movies = await Movie.find()
        .skip((page - 1) * size)
        .limit(size);
    res.send(movies);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
