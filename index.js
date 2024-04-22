require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECT_URI)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.log('Connection failed'+error);
  });

// Middleware
app.use(express.static('views'));
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

// Schema
const imageSchema = new mongoose.Schema({
  name: String,
  image: {
    data: Buffer,
    contentType: String
  }
});

const picture = mongoose.model("picture", imageSchema);

// Multer configuration
const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage: storage });

// Routes
app.get('/upload', (req, res) => {
  res.render('uploads');
});

app.get('/', (req, res) => {
  res.render('index');
});

// app.get('/homepage', (req, res) => {
//   res.render('homepage');
// });

app.get('/log-in', (req, res) => {
  res.render('log-in');
});

app.get('/images',async(req,res)=>{
  const images = await picture.find().sort({_id:-1})

  res.render('images',{images:images})
})

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const image = new picture({
      name: req.body.name,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    await image.save();
    res.redirect('/images');
  } catch (error) {
    res.status(500).json({ message: "Failed to upload image" });
  }
});


app.get('/images',async(req,res)=>{
  const images = await picture.find().sort({_id:-1})

  res.render('images',{images:images})
})

app.listen(PORT, () => {
  console.log(`The server is listening on port: ${PORT}`);
});
