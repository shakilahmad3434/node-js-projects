const findDB = require('./db');


exports.find = async (req, res) => {
    const findRes = await findDB.findTodo();
    if(findRes.status_code === 200){
        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.write(JSON.stringify(findRes));
        return res.end();
    } else{
        res.writeHead(500, {'Content-Type' : 'application/json'});
        res.write(JSON.stringify(findRes));
        return res.end();
    }
}