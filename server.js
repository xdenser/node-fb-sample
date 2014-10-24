var express = require('express'), 
    app = express(),
    fs = require('fs'),
    fb = require('firebird');
    bodyParser = require('body-parser');

var CFG = LoadConfig();
CFG.connections = CFG.connections||[];

app.use(bodyParser.urlencoded({ extended: false }))    // parse application/x-www-form-urlencoded
app.use(bodyParser.json())    // parse application/json
app.get('/', function(req, res){
  res.redirect('/index.html');
});

app.get('/connections',function(req,res){
    var conns = [];
    CFG.connections.forEach(function(el){
        conns.push(el.Name);
    });
    res.end(JSON.stringify(conns));
});


app.post('/checkconnection',function(req,res){
    try{
       //req.body.check
       var conn = fb.createConnection();
       var o = JSON.parse(req.body.check);
       conn.connect(o.database,o.user,o.password,o.role,function(err){
           var r = {
             err: err?err.message:null,
             connected: conn.connected  
           };
           res.end(JSON.stringify(r));
       })
       
       conn.on('error',function(){});
    }
    catch(e)
    {
       res.end(JSON.stringify({
           err: e.message,
           connected: false
       })); 
    }
});

app.post('/getconnection',function(req,res){
    var name =  req.body.name,
        conn = searchConn(name);
    res.end(JSON.stringify(conn));
});

app.post('/deleteconnection',function(req,res){
    var name = req.body.name, didx = -1;
    
    CFG.connections.forEach(function(el,idx){
        if(el.Name==name) didx = idx;
    });
    if(didx>=0){
        CFG.connections.splice(didx,1);
        SaveConfig(CFG);
        res.end(JSON.stringify({err: null}));
        return;
    }
        
    res.end(JSON.stringify({err: 'not found'}));
});
    

function searchConn(name){
    var r = null
    CFG.connections.forEach(function(el){
        if(el.Name == name) r = el;
    });
    return r;
}

app.post('/addconnection',function(req,res){
    var o = JSON.parse(req.body.connection);
    if(searchConn(o.Name)){
        res.end(JSON.stringify({
           err: 'Connection with name '+o.Name+' already exists'
       }));
    }
    else
    {
       CFG.connections.push(o);
       SaveConfig(CFG);
       res.end(JSON.stringify({
           err: false
       }));  
    }
    
});

function reportError(res,err)
{
    if(err){
        res.end(JSON.stringify({err: err.message}));
        return true;
    }
    return false;
}

app.post('/runQuery',function(req,res){
   var connSetts = searchConn(req.body.connection),
       sql = req.body.sql,
       conn = fb.createConnection();
   if(reportError(res,connSetts?null:{message:'no connection'})) return;    
   conn.connect(connSetts.database,connSetts.user,connSetts.password,connSetts.role,function(err){
      if(reportError(res,err)) return; 
      conn.query(sql,function(err,qres){
         if(reportError(res,err)) return;
         res.write('{"err":false,\n');
         //var row = qres.fetchSync(1,true), fields = [],fr = [];
         
         var first = true;
         qres.fetch('all',true,function(obj){
             var fields = [],fr = [];
             if(first){
              for(var f in obj){
               fields.push(f);
               fr.push(obj[f]);
              };
              res.write('"fields":'+JSON.stringify(fields)+',\n "data":['+JSON.stringify(fr));
              first = false;
             }
             else
             {
               for(var f in obj){fr.push(obj[f]);};
               res.write(','+JSON.stringify(fr));
             }
         },
         function(err,eof){
             if(reportError(res,err)) return;
             if(first) {
               res.end('"fields":[],"data":[]}');
               return;
             }
             res.end(']}');
         }); 
      }); 
   });
   conn.on('error',function(){});     
});

app.use( express.static(__dirname + '/public') );

var port = 8080;
app.listen(port);
console.log('Server started at http://localhost:'+port);

function LoadConfig()
{
 var cfg = {};
 try{
    fs.statSync(__dirname + '/cfg/cfg.json');
    var sCfg = fs.readFileSync(__dirname + '/cfg/cfg.json','utf8');
    cfg = JSON.parse(sCfg);    
 }
 catch(e){
   console.log("Error loading config "+e.message)                    
 }
 return cfg;
}

function SaveConfig(cfg)
{
  fs.writeFileSync(__dirname + '/cfg/cfg.json',JSON.stringify(cfg));
}

