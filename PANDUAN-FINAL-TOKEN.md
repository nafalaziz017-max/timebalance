# TimeBalance — Final Production Token

## Pasangan kunci
Public Key sudah dipasang ke:
- `apk-source/www/app.js` melalui `TOKEN_PUBLIC_KEY`
- `website/admin/index.html` sebagai expected production key

Private Key produksi ada di file terpisah `TimeBalance-PRIVATE-KEY-PRODUKSI-RAHASIA.txt` dan sengaja TIDAK dimasukkan ke ZIP final.

## Cara memakai Admin Panel
1. Upload folder `website/` ke `htdocs` sehingga `website/admin/` menjadi `/admin/`.
2. Buka `/admin/` lewat HTTPS.
3. Tempel Private Key produksi dari file rahasia.
4. Klik **Cek Private Key**. Harus muncul bahwa Private Key cocok dengan APK produksi.
5. Masukkan email akun pembeli yang sama dengan akun di APK.
6. Pilih paket: bulanan Rp19.000 / tahunan Rp50.000.
7. Verifikasi pembayaran QRIS terlebih dahulu.
8. Klik **Buat Token Premium** dan kirim token ke pembeli.

## Di APK
Pembeli login dengan email yang sama → Profil → Premium → masukkan token. APK memverifikasi signature ECDSA P-256 dan mencocokkan email token.

## Penting
- Jangan membuat pasangan kunci baru kecuali Anda sengaja membangun APK baru dan mengganti Public Key.
- Jangan menaruh Private Key di `website/`, GitHub, APK, atau `www/`.
- ZIP final berisi source APK/Capacitor, bukan file APK binary yang sudah dikompilasi. Build APK dari `apk-source` menggunakan workflow GitHub atau Android/Capacitor.
