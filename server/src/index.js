const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const { validation } = require("../middleware/Middleware");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//doc db.json
const data1 = fs.readFileSync("./db.json");
const data = JSON.parse(data1);

//lay tat ca todo
app.get("/api/v1/todos", (req, res) => {
    const { per_page } = req.query;
    const data1 = fs.readFileSync("./db.json");
    const data = JSON.parse(data1);
    const resultPerpage = data.slice(0, +per_page);
    res.status(200).json(resultPerpage);
});

//router them
app.post("/api/v1/todos", validation, (req, res) => {
    const index = data.findIndex(item => item.name == req.body.name)
    if (index == -1) {
        data.unshift(req.body);
        fs.writeFileSync("./db.json", JSON.stringify(data));
        res.status(200).json({
            messange: "Đã thêm thành công",
            todo: data,
        });    
    }else{
      res.status(402).json({
         messange: "Công việc đã có rồi",
      })
    }
});

//router xoa
app.delete("/api/v1/todos/:id", (req, res) => {
  const { id } = req.params;
  const result = data.filter((item) => item.id != id);
  fs.writeFileSync("./db.json", JSON.stringify(result));
  res.status(200).json(result);
});

//router update todo
app.patch("/api/v1/todos/:id",validation,(req,res)=>{
    const {id} = req.params
    const index = data.findIndex(item=>item.id == id);
    data[index] = req.body
    fs.writeFileSync("./db.json",JSON.stringify(data))
    res.status(200).json(data)
})

//Clear All
app.delete("/api/v1/clear", (req, res) => {
  fs.writeFileSync("./db.json", JSON.stringify([]));
  res.status(200).json([]);
});

//router update complete
app.put("/api/v1/todos/:id", (req, res) => {
  const { id } = req.params;
  const index = data.findIndex((item) => item.id == id);
  data[index].complete = !data[index].complete;
  fs.writeFileSync("./db.json", JSON.stringify(data));
  res.status(200).json(data);
});

app.listen(8000, () => {
  console.log("Đã chạy vào cổng 8000");
});
