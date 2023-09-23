var express = require("express")
const multer = require('multer');
var app = express()
var fs = require("fs")
var cors = require("cors")
var bodyParser = require("body-parser")

var mysql = require("mysql")
const { hostname } = require("os")
var conn = mysql.createConnection({
    host: "sql11.freesqldatabase.com",
    user: "sql11648539",
    password: "7lXk2QTg7A",
    database: "sql11648539",
    hostname: "0.0.0.0"
})


app.use(
    cors({
        origin: "*"
    })
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

let cartellapath;  // Dichiarazione della variabile esterna



app.get("/getStudenti", function (req, res) {
    conn.query("SELECT * FROM studente", function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Errore nel server" });
        } else {
            console.log(result);
            res.send(result);
        }
    });
});


app.get("/getStudente/:id", function (req, res) {
    conn.query("SELECT * FROM studente WHERE id = " + req.params.id, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Errore nel server" });
        } else {
            console.log(result);
            res.send(result[0]);
        }
    });
});


app.put("/PutCartella", function (req, res) {
    console.log(req.body.path);
    cartellapath = req.body.path;
});



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, cartellapath); // Sostituisci con il percorso della tua cartella di destinazione
    },
    filename: function (req, file, cb) {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const studenteInfo = req.body.nome.toUpperCase() + '_' + req.body.cognome.toUpperCase();
      cb(null, "CERTIFICATO" + '_' + studenteInfo.replace(/\s+/g, '_') + '.pdf'); // Personalizza il nome del file e aggiungi l'estensione .pdf
    }
  });
  
  const upload = multer({ storage: storage });

app.post("/addStudente", upload.single('certificato_medico'), function (req, res) {
    const certificato_medico = req.file;  // File caricato
    const certificato_medicoPath = certificato_medico ? certificato_medico.path : null;

    conn.query("INSERT INTO `studente` (`nome`, `cognome`, `cf`, `nato_a`, `residenza`, `via`, `n_civico`, `corso`, `retta_mensile`, `telefono`, `email`, `certificato_medico`, `pagato_mensile`, `quota_ass`, `gen`, `feb`, `mar`, `apr`, `magg`, `giu`, `lug`, `ago`, `sett`, `ott`, `nov`, `dic`, `extra`  ) VALUES ('" + req.body.nome + "', '" + req.body.cognome + "', '" + req.body.cf + "', '" + req.body.nato_a + "', '" + req.body.residenza + "', '" + req.body.via + "', '" + req.body.n_civico + "', '" + req.body.corso + "', '" + req.body.retta_mensile + "', '" + req.body.telefono + "', '" + req.body.email + "', '" + certificato_medicoPath + "', 'niente', '0','0','0','0','0','0','0','0','0','0','0','0','0', '" + req.body.extra + "')", function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Errore nel server" });
        } else {
            console.log(result);
            res.send(result); // Invia il dato JSON come risposta
        }
    });
});





app.put("/UpdateStudente/:id", upload.single('certificato_medico'), function (req, res) {
    const certificato_medico = req.file;  // File caricato
    const certificato_medicoPath = certificato_medico ? certificato_medico.path : null;

    conn.query("UPDATE studente SET nome = '" + req.body.nome + "', cognome = '" + req.body.cognome + "', cf = '" + req.body.cf + "', nato_a = '" + req.body.nato_a + "', residenza = '" + req.body.residenza + "', via = '" + req.body.via + "', n_civico = '" + req.body.n_civico + "', corso = '" + req.body.corso + "', retta_mensile = '" + req.body.retta_mensile + "', telefono = '" + req.body.telefono + "', email = '" + req.body.email + "', certificato_medico = '" + certificato_medicoPath + "', pagato_mensile = 'niente', extra = '" + req.body.extra + "' WHERE id = " + req.params.id, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Errore nel server" });
        } else {
            console.log(result);
            res.send(result); // Invia il dato JSON come risposta
        }
    });
});



app.put("/UpdateMensile/:id", function (req, res) {
    conn.query("UPDATE studente SET quota_ass = '" + req.body.quota_ass + "', gen = '" + req.body.gen + "', feb = '" + req.body.feb + "', mar = '" + req.body.mar + "', apr = '" + req.body.apr + "', magg = '" + req.body.magg + "', giu = '" + req.body.giu + "', lug = '" + req.body.lug + "', sett = '" + req.body.sett + "', ott = '" + req.body.ott + "', nov = '" + req.body.nov + "', dic = '" + req.body.dic + "' WHERE id = " + req.params.id, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Errore nel server" });
        } else {
            console.log(result);
            res.send(result); // Invia il dato JSON come risposta
        }
    });
});


app.delete("/DeleteStudente/:id", function(req, res){
    conn.query("DELETE FROM studente WHERE `studente`.`id` = "+req.params.id, function(err, result) {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Errore nel server" });
        } else {
          console.log(result);
          res.send(result); // Invia il dato JSON come risposta
        }
      });
    });



var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("server is running")
})