const http = require('http');
const fs = require('fs');

// local module
const addTodo = require('./task_api/add');
const findTodo = require('./task_api/find');
const updateTodo = require('./task_api/update');
const deleteTodo = require('./task_api/delete');

const server = http.createServer((req, res) => {
    //html page routing
    if(req.url === '/'){
        fs.readFile('html/index.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
          });
    }
    // js page routing
    else if(req.url === '/js/index.js'){
        fs.readFile('js/index.js', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.write(data);
            return res.end();
          });
    }

    // api request
    else if(req.url === '/task' && req.method === 'POST'){
        addTodo.add(req,res);
    }
    else if(req.url === '/api'){
        findTodo.find(req,res);
    } else if(req.url === '/update' && req.method === 'POST'){
        updateTodo.update(req,res);
    } else if(req.url === '/delete' && req.method === 'POST'){
        deleteTodo.deleteData(req,res);
    }

     else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('Page Not Found');
        return res.end();
    }

});

// PORT and LISTEN REQUEST
const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Your server is running http://localhost:${PORT}`);
})