const app = require("express")();
const bodyParser = require('body-parser')
const cors = require('cors');
const redis = require('redis');
let redisClient =  redis.createClient()
const {promisify} = require('util')
const get = promisify(redisClient.get).bind(redisClient);
const set = promisify(redisClient.set).bind(redisClient);

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const persons = ['avi','ron','idan','itzik','shmulik','ruven','rachel']
let data = {}
const mysql = require('mysql2')
let pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "qwerasdf",
    database: "mydb",
    connectionLimit: 25
});

const createTables = () => {
    const itemsArray = ['television','wallet','microwave','airpods','sunglasses','key_ring','snacks']



    let itemsStr = itemsArray.reduce((acc,current,index)=>{
        if(acc.length===0){
            return `${current} VARCHAR(255),`
        }
        else {
            return `${acc} ${current} VARCHAR(255)${index<itemsArray.length-1?',':''}`
        }
    },'')


    let data = {persons:`name VARCHAR(255), persons_items VARCHAR(255)`,items:itemsStr}


    Object.entries(data).forEach(([key,value])=>{
        let sql = `CREATE TABLE ${key} (${value})`;
        console.log(sql)
        pool.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table created");
        });
    })


}

const initializeItemsTable = () => {
    const itemsArray = ['television','wallet','microwave','airpods','sunglasses','key_ring','snacks']
    let sql = `INSERT INTO items (${itemsArray.join(',')}) VALUES ?`;


    let values = [
        ['living-room','bedroom','kitchen','bedroom','living-room','kitchen','service-room']
    ]

    pool.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });

}

const initializePersonsTable = () => {
    const itemsArray = ['television','wallet','microwave','airpods','sunglasses','key_ring','snacks']
    let sql = `INSERT INTO persons (name, persons_items) VALUES ?`;
    let values = []
    const persons = ['avi','ron','idan','itzik','shmulik','ruven','rachel']


    persons.forEach((item)=>{
        let obj = {}
        itemsArray.forEach(()=>{
            obj[itemsArray[Math.floor(Math.random()*7)]]= true
        })
        let str = Object.keys(obj).join(',')
        values.push([item,str])

    })
    pool.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });

}
createTables()
initializeItemsTable()
initializePersonsTable()




const query = (sql,values) => {
    return new Promise((res,rej)=>{
        pool.query(sql,values, function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
            res(result)
        });
    })
}

app.post('/rooms',async (req,res)=>{

    let {item,room} = req.body
    if(!room||!item){
        res.json('bad credentials')
    }
    else {
        let sql = `UPDATE items SET ${item} = ?`;
        console.log(sql)
        let values = [room]
        pool.query(sql,values, function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
            res.json('great')
        });
    }
})
app.post('/person',async (req,res)=> {
    try {
        let {name} = req.body
        name = name.toLowerCase()
        const itemsArray = ['television', 'wallet', 'microwave', 'airpods', 'sunglasses', 'key_ring', 'snacks']

        let values = [name]

        let sql = itemsArray.reduce((acc, current, index) => {
            if (acc.length === 0) {
                return `SELECT (SELECT persons_items FROM persons WHERE name = ?) as items, (SELECT ${current} FROM items) as ${current},`
            } else {
                return `${acc} (SELECT ${current} FROM items) as ${current}${index < itemsArray.length - 1 ? ',' : ''}`
            }
        }, '')
        console.log(sql)

        let result = (await query(sql, values))[0]
        let finalResult = null
        console.log(result.items)
        if (result.items) {
            let items = result.items.split(',')
            finalResult = {}
            items.forEach((item) => {
                finalResult[item] = result[item]
            })
            res.json({finalResult})
        }
        else{
            throw 'bad credentials'
        }
    }
    catch (err){
        res.json('wrong credentials')
    }
})

app.post('/get',(req,res)=>{
    res.json('homo')

})

app.listen(3001, () => {
    console.log("apps running 3001");
});