const port = 5000;
const express = require("express");
const db = require("./db");
const app = express();

app.use(express.json());

const { uuid } = require("uuidv4");

const { Users, Arts } = require("./schema");

const articles = [
  {
    id: 1,
    title: "How I learn coding?",
    description: "Lorem, Quam, mollitia.",
    author: "Jouza",
  },
  {
    id: 2,
    title: "Coding Best Practices",
    description: "Lorem, ipsum dolor sit, Quam, mollitia.",
    author: "Besslan",
  },
  {
    id: 3,
    title: "Debugging",
    description: "Lorem, Quam, mollitia.",
    author: "Jouza",
  },
];
// 1. getAllArticles
app.get("/articles", (req, res) => {
  Arts.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.send(error);
    });

  // res.json(articles);
  // res.status(200);
});

// 2. getAnArticleById
app.get("/article/:id", (req, res) => {
  const id = req.params.id;

  const found = articles.find((element) => {
    return element.id == id;
  });

  if (found) {
    res.status(200);
    res.json(found);
  } else {
    res.status(404);
    res.json("Not found");
  }
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

  // const found = articles.filter((element) => {
  //   return element.author === author;
  // });

  // if (found) {
  //   res.status(200);
  //   res.json(found);
  // } else {
  //   res.status(404);
  //   res.json("Not found");
  // }
});

// 4. createNewArticle
app.post("/articles", async (req, res) => {
  // const {title, description, author} = req.body
  const { title, description } = req.body;
  let author1;
  // go to database and find the user with id that is passed in from postman and then add it to the article as the author
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
  const updatedArticle = {
    id: articleId,
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
  };
  let found = articles.find((element) => {
    return element.id == articleId;
  });
  let index = articles.indexOf(found);
  articles[index] = updatedArticle;
  res.json(updatedArticle);
  res.json(200);
});

// 6. deleteAnArticleById
app.delete("/articles/:id", (req, res) => {
  const articleId = req.params.id;
  const success = {
    success: true,
    massage: ` Success Delete article with id => ${articleId}`,
  };
  let found = articles.find((element) => {
    return element.id == articleId;
  });
  let index = articles.indexOf(found);
  articles.splice(index, 1);

  res.json(success);
});
// 7. deleteArticlesByAuthor
app.delete("/articles", (req, res) => {
  const authorName = req.body.author;
  const success = {
    success: true,
    massage: ` Success delete all the articles for the author => ${authorName}`,
  };
  let found = articles.filter((element) => {
    return element.author === authorName;
  });

  found.forEach((element) => {
    let i = articles.indexOf(element);
    articles.splice(i, 1);
  });

  res.json(success);
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

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
