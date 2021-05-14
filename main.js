const port = 5000;
const express = require("express");
const app = express();

app.use(express.json());
  
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
  res.json(articles);
  res.status(200);
});
const found = articles.find((element) => {
    return element.id === 2
})
console.log(found);
// 2. getAnArticleById
app.get("/article/:id", (req, res) => {
    const id = req.params.id;
    console.log(id);
    const found = articles.find((element) => {
        return element.id === id
    })
    
    console.log(found);
    if(found){
        res.status (200);
        console.log(found);
        res.json(found)
    }else{
        res.status(404);
        res.json("Not found")
    }
});

// 3. getArticlesByAuthor
app.get("/articles/search_1", (req, res) => {
    const author = req.query.author;
    const found = articles.filter((element) => {
        return element.author === author
    })

    if(found){
        res.status (200);
        res.json(found)
    }else{
        res.status(404);
        res.json("Not found")
    }
});
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
