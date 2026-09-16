const express = require("express");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

// 2. LOGGING MIDDLEWARE (Her istekte çalışır)
app.use((req, res, next) => {
    const tarih = new Date().toISOString(); // Anlık tarih ve saat
    const metod = req.method;               // GET, POST vb.
    const url = req.url;                     // Hangi adrese girildi (/ veya /style.css)
    const ip = req.ip;                       // İsteğin geldiği IP adresi

    // Dosyaya yazılacak formatı hazırlayalım
    const logSatiri = `[${tarih}] - Metod: ${metod} | URL: ${url} | IP: ${ip}\n`;

    // fs.appendFile: Dosya yoksa oluşturur, varsa SONUNA ekler (üzerine yazmaz)
    fs.appendFile('log.txt', logSatiri, (err) => {
        if (err) {
            console.error("Log dosyasına yazılırken hata oluştu:", err);
        }
    });

    // next(): İşlemin takılı kalmaması ve bir sonraki adıma (rotalara) geçmesi için şarttır!
    next();
});

app.get("/", (req, res) => {
    res.render("index", {
        user: "Sir"
    });
});

app.listen(PORT, () => {
    console.log("Sunucu http://localhost:${PORT} üzerinde çalışıyor...")
})

