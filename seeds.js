const mongoose = require('mongoose');
const userInfo = require('./models/userInfo');

mongoose.connect('mongodb://localhost:27017/mainProjectdb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


    const user = new userInfo({
        fName: "Ahmed",
        lName: "samir",
        mobileNum:"01221377654",
        Email: "cocoxoxo1212@outlook.com",
        Password: "ahmed123",
        nationalId:12654798076543,
        birthDate: 1997-12-03
    })
        user.save()
            .then(p => {
                console.log(p)
            })
            .catch(e => {
                console.log(e)
            })
        