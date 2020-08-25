const express = require('express') //Import Express
const app = express() //Holds express app
const mySqlClient  = require('mysql')

var con = mySqlClient.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'YOUR PASSWORD HERE',
    database: 'YOUR DB NAME HERE'
})

con.connect(function(err) {
    if(err) res.status(400).send()
    console.log("Connected")

    app.post('/signup', (req, res) => {
        
        var user = req.body.username
        var email = req.body.email
        var password = req.body.password

        //Add function for unique email registration
        
        var values = {
            userName: user,
            userEmail: email,
            password: password
        }

        var sqlStatement1 = "INSERT INTO users (userName, userEmail, password) VALUES ('" + user + "','" + email + "','" + password + "');"        

        con.query(sqlStatement1, function(err, result) {
            if(err) {
                res.status(400).send()
                console.log("Error Not Inserted")
                console.log(err.message.toString())
            } else {
                console.log("1 record inserted")
                res.status(200).send()
            }            
        })
    })

    app.post('/login', (req, res) => {
        
        var sqlStatement = "SELECT * FROM users WHERE userEmail = ? AND password = ?";        
        
        var email = req.body.email
        var password = req.body.password        

        con.query(sqlStatement, [email, password], function(err, result) {
            if(err){ 
                res.status(400).send()
                console.log(err.message.toString())
            } else {
                    if(result != null) {
                        console.log(result)
                        console.log("Login Successful")
                        const objToSend = {
                            name: result.userName,
                            email: result.userEmail
                        }

                        res.status(200).send(JSON.stringify(objToSend))
                    } else {
                        res.status(404).send()
                    }
            }
        })
    })
})

app.use(express.json()) //Enabled json parsing

app.listen(3000, () => {
    console.log("Listening on port 3000")
})

