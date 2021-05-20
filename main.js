const port = 5000;
const express = require("express");
const db = require("./db");
const app = express();

app.use(express.json());

const { uuid } = require("uuidv4");

const { Users, Arts, Comments } = require("./schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


// 1. getAllArticles
app.get("/articles", (req, res) => {
  Arts.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.send(error);
    });
});
app.get("/users", (req, res) => {
  Users.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.send(error);
    });
});
// 2. getAnArticleById
app.get("/article/:id", (req, res) => {
  const id = req.params.id;

  Arts.findOne({ _id: id })
    .populate("author", "firstName")
    .exec()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

// 3. getArticlesByAuthor
app.get("/articles/search_1", (req, res) => {
  const authorID = req.query.author;
  Arts.find({ author: authorID })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

// 4. createNewArticle
app.post("/articles", async (req, res) => {
  const { title, description } = req.body;
  let author1;
  await Users.findOne({ _id: "60a36ef43afd3530a472084c" })
    .then((result) => {
      author1 = result;
    })
    .catch((error) => {
      console.log(error);
    });
  const article = new Arts({
    title,
    description,
    author: author1.firstName,
  });
  article
    .save()
    .then((result) => {
      res.json(result);
      res.json(201);
    })
    .catch((error) => {
      res.send(error);
    });
});

// 5. updateAnArticleById
app.put("/articles/:id", (req, res) => {
  const articleId = req.params.id;
  Arts.findOneAndUpdate(
    { _id: articleId },
    { title: req.body.title, description: req.body.description }
  )
    .populate("author", "firstName")
    .exec()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

// 6. deleteAnArticleById
app.delete("/articles/:id", (req, res) => {
  const articleId = req.params.id;
  Arts.findOneAndDelete({ _id: articleId })
    .then((result) => {
      res.json(result);
    })
    .catch((result) => {
      res.send(error);
    });
});
// 7. deleteArticlesByAuthor
app.delete("/articles/:author", (req, res) => {
  const authorID = req.params.author;
  console.log(authorID);
  Arts.findOneAndDelete({ author: authorID })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

// createNewAuthor
app.post("/users", (req, res) => {
  const { firstName, lastName, age, country, email, password } = req.body;
  const user = new Users({
    firstName,
    lastName,
    age,
    country,
    email,
    password,
  });
  user
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.json(error);
    });
});

// login
app.post("/login", (req, response) => {
  const { email, password } = req.body;
  Users.findOne({ email: email }).then((result) => {
    if (result === null) {
      let error = {
        message: "The email doesn't exist",
        status: 404
      }
      response.json(error);
      response.status(404);
    }else{
      // hashedPassword the password that is stored in DB
      bcrypt.compare(password,result.password,(err,result1)=>{
        if (result1 === true){
          const payload = {
            userId: result._id,
            country: result.country
          }
          const options = {
            expiresIn: "60m",
          };
          const SECRET = process.env.SECRET;
          const token = {
            token: jwt.sign(payload, SECRET, options)
          };
          response.json(token)
        }else{
          let error = {
            message: "The password you’ve entered is incorrect",
            status: 404
          }
          response.json(error);
          response.status(404)
        }
      })
    }
  });
});
// createNewComment
app.post("/articles/:id/comments", (req, res) => {
  const articleId = req.params.id;
  const { comment, commenter } = req.body;
  const addComment = new Comments({ comment, commenter });
  addComment
    .save()
    .then((result) => {
      res.json(result);
      res.status(201);
    })
    .catch((error) => {
      res.send(error);
    });
  // Arts.findOne({ _id: articleId })
  //   .then((result) => {
  //     res.json(result);
  //   })
  //   .catch((error) => {
  //     res.send(error);
  //   });
});
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
