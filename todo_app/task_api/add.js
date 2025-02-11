const addDB = require('./db');

// export add todo on dabase
exports.add = (req, res) => {
  let taskdata = "";
  req.on("data", (chunks) => {
    taskdata += chunks.toString();
  });

  req.on("end", async () => {
    const userInfo = JSON.parse(taskdata);
    const addUser = await addDB.add(userInfo);
    if(addUser.status_code === 200){
        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.write(JSON.stringify(addUser));
        return res.end();
    } else{
        res.writeHead(500, {'Content-Type' : 'application/json'});
        res.write(JSON.stringify(addUser));
        return res.end();
    }
  });
};
