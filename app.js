const express=require("express");
require("dotenv").config();
const PORT=process.env.PORT||3000
const app=express();
const path=require("path");
app.set("view engine", 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
const fs=require('fs');
app.get("/",(req,res)=>{
    fs.readdir(`./hissab`,(err,files)=>{
        if(err) return res.status(500).send(err);
        res.render("index",{files:files});
    })
})
app.get("/create",(req,res)=>{
    res.render("create")
})
app.post(`/createhisaab`,(req,res)=>{
    const d = new Date();
const day = String(d.getDate()).padStart(2, '0');
const month = String(d.getMonth() + 1).padStart(2, '0');
const year = d.getFullYear();
var date=`${day}-${month}-${year}`;
     let counter = 1;
  let filePath = path.join(__dirname, `./hissab/${day}-${month}-${year}.txt`);

  // Check if file exists, and if it does, keep adding a number
  while (fs.existsSync(filePath)) {
    filePath = path.join(__dirname, `./hissab/${date}-${counter}.txt`);
    counter++;
  }


    fs.writeFile(filePath,req.body.content,(err)=>{
        if(err) return res.status(500).send(err);
        res.redirect("/");
    })
})
app.get('/edit/:filename',(req,res)=>{
    fs.readFile(`./hissab/${req.params.filename}`,"utf-8",(err,data)=>{
        if(err) return res.status(500).send(err);
        res.render("edit",{hissabdata:data,date:req.params.filename});
    })
})
app.get("/hisaab/:filename",(req,res)=>{
    fs.readFile(`./hissab/${req.params.filename}`,"utf8",(err,data)=>{
        if(err) return res.status(500).send(err);
        res.render("hissab",{filedata:data,date:req.params.filename});

    })
})
app.post('/update/:filename',(req,res)=>{
    fs.writeFile(`./hissab/${req.params.filename}`,req.body.content,(err)=>{
        if(err) return res.status(500).send(err);
        res.redirect("/");
    })
})
app.get("/delete/:filename",(req,res)=>{
    fs.unlink(`./hissab/${req.params.filename}`,(err)=>{
        if(err) return res.status(500).send(err);
        res.redirect("/");
    })
})


app.listen(PORT,()=>{
    console.log("running at port number 3000")
})