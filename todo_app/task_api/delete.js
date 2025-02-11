const deleteDB = require('./db');

exports.deleteData = (req, res) => {
    let deleteId = '';
    req.on('data', chunks => {
        deleteId += chunks.toString();
    });

    req.on('end', async () => {
        const id = JSON.parse(deleteId).insertedId;
        const deleteRes = await deleteDB.deleteTodo(id);
        if(deleteRes.status_code === 200){
            res.writeHead(200, {'Content-Type' : 'application/json'});
            res.write(JSON.stringify(deleteRes));
            return res.end();
        } else{
            res.writeHead(500, {'Content-Type' : 'application/json'});
            res.write(JSON.stringify(deleteRes));
            return res.end();
        }
    })
}