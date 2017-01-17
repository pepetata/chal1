var express = require('express')
 , stylus = require('stylus')
 , app = express()
 , lowerCase = require('lower-case')
 , param, dt
 , ts = {unix: null,natural:null}

app.set('views', __dirname );
app.set('view engine', 'stylus');
app.use(express.static(__dirname));
app.use(stylus.middleware( __dirname));
// app.get('*', function (req, res) {
//     console.log(req.url)
// })
app.get('*', function (req, res) {
    var months = ['January','February','March', 'April', 'May', 'June','July','August','September','October','November','December'];
    param = req.url.substr(1)
    if (param <" " || param === "style.css"|| param === "favicon.ico") {
        res.render('timestamp-ms.jade',{title: 'Timestamp - Microservice'});
    } else {
        if ( ! isNaN(parseFloat(param))) {
            dt = new Date()
            dt.setTime(Number(param))
            ts.unix= param;
            ts.natural = months[dt.getMonth()] + " " + dt.getDate() +', ' + dt.getFullYear()
        } else {
            var m=param.substr(0,param.indexOf('%20'))
            console.log(m,months.indexOf(lowerCase(m)) )
            // is this a month?
            if (lowerCase(months).indexOf(lowerCase(m)) >= 0 ) {
                var d = param.substr(param.indexOf('%20')+3)
                d = Number(d.substr(0,d.indexOf('%20')-1))
                if (! (d.isNaN || d<1 || d >31)) {
                    var y = param.substr((param.length-4))
                    ts.natural = m + " " + d +", " + y
                    dt= new Date()
                    dt.setFullYear(y, lowerCase(months).indexOf(lowerCase(m)), d)
                    console.log(dt)
                    ts.unix = dt.getTime()
                }
            }
        }
        console.log(param,m,'d=',d,y)
        // if (Object.prototype.toString.call(param) !== '[object Date]') return ts;
        res.send(JSON.stringify(ts))
    }
})

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})

