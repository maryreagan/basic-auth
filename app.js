require("dotenv").config()
const Express = require("express")
const app = Express()
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

app.use(Express.json())
app.use(Express.urlencoded())
app.use(Express.static("./public"))
const User = require("./models/Users")

const PORT = process.env.PORT || 4000
const MONGO_URL = process.env.MONGO_URL
mongoose
    .connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log(`connected to ${MONGO_URL}`))
    .catch((err) => console.log(err))

    
app.post("/login", async (req, res) => {
    let userObj = await User.findOne({username: req.body.username})

bcrypt.compare(req.body.password, userObj.password, (err, result) => {
    if(err) {
        res.status(403).send("Access denied")
    } else {
        res.redirect(`/dashboard/${userObj.username}`)
    }
})
})

app.post("/signup", async (req, res) => {
    let saltRounds = process.env.SALT

bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
    let userDoc = {
        username: req.body.username,
        password: hash
    }

    let user = new User(userDoc)

    user.save()

    res.redirect("/")

})
})

app.get("/dashboard/:username", (req, res) => {
res.send(`<h1>Hello ${req.params.username}</h1>`)
})

app.listen(PORT, (req, res) => {
    console.log(`Listening on PORT ${PORT}`)
})