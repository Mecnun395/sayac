// ELEMAN SEÇİMLERİ
const bd = document.getElementById("bd");
const sifirlaBtn = document.getElementById("sifirla");
const turBtn = document.getElementById("tur-btn");

const sn = document.getElementById("sn");
const dk = document.getElementById("dk");
const salise = document.getElementById("salise");
const saliseAlani = document.getElementById("salise-alani");

const turYazisi = document.querySelector("#tur-sayaci span");
const pomoBilgi = document.getElementById("pomo-bilgi");
const isaretPaneli = document.getElementById("isaret-paneli");
const isaretListesi = document.getElementById("isaret-listesi");

const pomoModBtn = document.getElementById("pomo-mod-btn");
const kronModBtn = document.getElementById("kron-mod-btn");

// DEĞİŞKENLER
let aktifMod = "pomodoro"; // "pomodoro" veya "kronometre"
let zid = null;

// Pomodoro Değişkenleri
let kalan = 25 * 60; // 1500 saniye (25 dk)
let dorm = true;     // true: Ders, false: Mola
let turSayisi = 0;

// Kronometre Değişkenleri
let kronSaniye = 0;
let kronSalise = 0;
let isaretSayaci = 0;

// 1. EKRANI GÜNCELLEME FONKSİYONU
function big() {
    if (aktifMod === "pomodoro") {
        let dakka = Math.floor(kalan / 60);
        let saniye = kalan % 60;
        
        dk.textContent = dakka < 10 ? "0" + dakka : dakka;
        sn.textContent = saniye < 10 ? "0" + saniye : saniye;
    } else {
        let dakka = Math.floor(kronSaniye / 60);
        let saniye = kronSaniye % 60;
        
        dk.textContent = dakka < 10 ? "0" + dakka : dakka;
        sn.textContent = saniye < 10 ? "0" + saniye : saniye;
        salise.textContent = kronSalise < 10 ? "0" + kronSalise : kronSalise;
    }
}

// 2. SAYAÇ BAŞLATMA FONKSİYONU
function gsa() {
    if (zid !== null) return; // Zaten çalışıyorsa tekrar başlatma

    if (aktifMod === "pomodoro") {
        // POMODORO MODE: Her 1 saniyede GERİYE sayar
        zid = setInterval(function() {
            kalan--; // Saniyeyi eksilt
            big();   // Ekranı güncelle

            if (kalan <= 0) {
                clearInterval(zid);
                zid = null;

                if (dorm === true) {
                    dorm = false;
                    kalan = 5 * 60; // 5 Dk Mola
                    turSayisi++;
                    turYazisi.textContent = turSayisi;
                    alert("Çalışma bitti! Mola vakti.");
                } else {
                    dorm = true;
                    kalan = 25 * 60; // 25 Dk Ders
                    alert("Mola bitti! Ders vakti.");
                }

                big();
                bd.classList.remove("durdur");
                bd.classList.add("baslat");
                bd.textContent = "Başlat";
            }
        }, 1000);
    } else {
        // KRONOMETRE MODE: Her 10ms'de İLERİYE sayar
        zid = setInterval(function() {
            kronSalise++;
            if (kronSalise >= 100) {
                kronSalise = 0;
                kronSaniye++;
            }
            big();
        }, 10);
    }

    bd.classList.remove("baslat");
    bd.classList.add("durdur");
    bd.textContent = "Durdur";
}

// 3. SAYAÇ DURDURMA FONKSİYONU
function bjk() {
    clearInterval(zid);
    zid = null;
    bd.classList.remove("durdur");
    bd.classList.add("baslat");
    bd.textContent = "Başlat";
}

// 4. SIFIRLAMA FONKSİYONU
function sifirla() {
    bjk(); // Önce çalışan zamanlayıcıyı durdur
    
    if (aktifMod === "pomodoro") {
        dorm = true;
        kalan = 25 * 60; // 25 dakikaya sıfırla
    } else {
        kronSaniye = 0;
        kronSalise = 0;
        isaretSayaci = 0;
        isaretListesi.innerHTML = ""; // İşaret listesini temizle
    }
    big();
}

// 5. KRONOMETRE İŞARET EKLEME FONKSİYONU
function isaretEkle() {
    if (aktifMod !== "kronometre" || zid === null) return;

    isaretSayaci++;
    let dakka = Math.floor(kronSaniye / 60);
    let saniye = kronSaniye % 60;
    
    let dStr = dakka < 10 ? "0" + dakka : dakka;
    let sStr = saniye < 10 ? "0" + saniye : saniye;
    let salStr = kronSalise < 10 ? "0" + kronSalise : kronSalise;

    let li = document.createElement("li");
    li.innerHTML = `<span>#${isaretSayaci}</span> <span>${dStr}:${sStr}:${salStr}</span>`;
    isaretListesi.prepend(li);
}

// 6. MOD DEĞİŞTİRME FONKSİYONU
function modDegistir(yeniMod) {
    if (aktifMod === yeniMod) return;

    bjk(); // Sayacı durdur
    aktifMod = yeniMod;

    if (aktifMod === "pomodoro") {
        pomoModBtn.classList.add("aktif");
        kronModBtn.classList.remove("aktif");

        dorm = true;
        kalan = 25 * 60; // Pomodoro süresini garantiye al

        pomoBilgi.classList.remove("gizli");
        saliseAlani.classList.add("gizli");
        turBtn.classList.add("gizli");
        isaretPaneli.classList.add("gizli");
    } else {
        kronModBtn.classList.add("aktif");
        pomoModBtn.classList.remove("aktif");

        kronSaniye = 0;
        kronSalise = 0;

        pomoBilgi.classList.add("gizli");
        saliseAlani.classList.remove("gizli");
        turBtn.classList.remove("gizli");
        isaretPaneli.classList.remove("gizli");
    }

    big();
}

// ETKİLEŞİMLER
bd.addEventListener("click", function() {
    if (bd.classList.contains("durdur")) {
        bjk();
    } else {
        gsa();
    }
});

sifirlaBtn.addEventListener("click", sifirla);
turBtn.addEventListener("click", isaretEkle);

pomoModBtn.addEventListener("click", function() { modDegistir("pomodoro"); });
kronModBtn.addEventListener("click", function() { modDegistir("kronometre"); });

// İLK ÇALIŞTIRMA
big();











