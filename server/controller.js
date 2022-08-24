// boilerplate code
// let's import the dotenv package, configure it, so we can use the variables
require("dotenv").config();
// now we need to import sequelize. note that the default export is a class
const Sequelize = require("sequelize");
// destructure the connection_string from our process.env object.
const { CONNECTION_STRING } = process.env;

// isntantiate a sequelize object from the Sequelize class.
const sequelize = new Sequelize(CONNECTION_STRING , {
    dialect: "postgres" ,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

// JUST FORE THIS DEMO, let's declare a few variables
const userId = 4;
const clientId = 3;

module.exports = {
    getUserInfo: (req , res) => {
        sequelize.query(`select * from cc_clients as c 
        join cc_users as u 
        on c.user_id = u.user_id
        where u.user_id = ${userId};`)
        .then((dbResponse) => {
            // sequelize will store your data at the index of 0
            res.status(200).send(dbResponse[0])
        })
        .catch((err) => {
            console.log(err);
        })
    } ,

    updateUserInfo: (req , res) => {
        let {
            firstName ,
            lastName ,
            email ,
            phoneNumber ,
            address ,
            city ,
            state ,
            zipCode
        } =req.body

        sequelize.query(`
        update cc_users
        set first_name='${firstName}',
            last_name='${lastName}',
            email='${email}',
            phone_number=${phoneNumber}
        where user_id=${userId};
        
        update cc_clients
        set address='${address}',
            city='${city}',
            state='${state}',
            zip_code=${zipCode}
        where user_id=${userId};`)
            .then((dbResponse) => {
                res.status(200).send(dbResponse[0])
            })
            .catch ((err) => {
                console.log(err);
            })
    } ,

    getUserAppt: (req , res) => {
        sequelize.query(`select * from cc_appointments
        where client_id=${clientId}
        order by date desc;
        `)
            .then((dbResponse) => {
                res.status(200).send(dbResponse[0]);
            })
            .catch((err) => {
                console.log(err);
            })
    } ,

    requestAppointment: (req , res) => {
    const { date , service } = req.body
console.log(date)
        sequelize.query(`insert into cc_appointments(client_id , date , service_type , notes , approved , completed)
        values(${clientId} , '${date}' , '${service}' , 'test' , false , false)
        returning *;`)
            .then((dbResponse) => {
                res.status(200).send(dbResponse[0]);
            })
            .catch((err) => {
                console.log(err);
            })
    }
}