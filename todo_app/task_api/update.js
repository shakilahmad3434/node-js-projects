const updateDB = require('./db');

exports.update = async (req, res) => {
    let todoValue = '';
    req.on('data', chunks => {
        todoValue += chunks.toString();
    });

    req.on('end', async () => {
        const updateInfo = JSON.parse(todoValue);
        const id = updateInfo.insertedId;
        const updateObj = { task: updateInfo.task };
        const updateRes = await updateDB.updateTodo(id, updateObj);
            if(updateRes.status_code === 201){
                res.writeHead(200, {'Content-Type' : 'application/json'});
                res.write(JSON.stringify(updateRes));
                return res.end();
            } else if(updateRes.status_code === 404){
                res.writeHead(404, {'Content-Type' : 'application/json'});
                res.write(JSON.stringify(updateRes));
                return res.end();
            } else{
                res.writeHead(500, {'Content-Type' : 'application/json'});
                res.write(JSON.stringify(updateRes));
                return res.end();
            }
    })
}