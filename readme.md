# Sirius.js
***
Sirius.js - Framework node.js untuk service backend, RESTful API, Websocket Server untuk komunikasi real-time dan server GraphQL

## Postman Collection
Route dasar Sirius.js bisa disimulasikan di Postman. Lihat [Collection](https://documenter.getpostman.com/view/2768632/RWMENU3Z#4f1085d5-aedf-7b8d-2b89-1163ec7ab4ab)

## Prasyarat
***
Untuk menggunakan framework ini, pertimbangkan kita sudah menginstall dan memahami hal-hal berikut
- [NodeJS](https://nodejs.org/en/) terinstall *
- [NPM](https://nodejs.org/en/) terinstall *
- Pengetahuan tentang NodeJS (Objects, Modules) *
- Pengetahuan tentang ECMAScript 6 *
- Pengetahuan tentang Object Relational Mapping ([Sequelize](http://docs.sequelizejs.com/)) *
- Pengetahuan tentang routing & middleware ([ExpressJS](https://expressjs.com/))
- Pengetahuan dasar Babel compiler
- Konsep event & broadcast pada websocket
- Konsep migration & seed

_(*) Harus terinstall/diketahui_

## Memulai
***
#### Mendapatkan package Sirius.js
Jika prasyarat sudah terpenuhi, maka anda sudah bisa mulai menggunakan Sirius.js.
Download release Sirius.js [disini](https://github.com/EdgarJeremy/sirius.js/releases) atau clone langsung dari git repository

```bash
$ git clone https://github.com/edgarjeremy/sirius.js project-name
```
#### Menginstall Sirius.js
Jika kopian Sirius.js sudah berada di mesin anda, selanjutnya jalankan perintah ini untuk menginstall module dasar yang dibutuhkan dalam internal framework.

```bash
$ cd project-name
$ npm install 
```

## Konfigurasi
***
Semua konfigurasi framework Sirius.js terdefinisikan sebagai object pada file `./config.json`
#### Server
Konfigurasi server berhubungan dengan bagaimana Sirius.js menjalankan servicenya sebagai server yang akan melayani request dari client. Konfigurasi ini terdapat di bagian `server` dan terdiri dari beberapa field :
- Protocol (Protokol apa yang digunakan Sirius.js untuk berjalan => `'http'`|`'https'`)
- Port (Port tempat Sirius.js untuk mendengarkan request)

#### Request
Konfigurasi ini berfungsi mengatur bagaimana request masuk ke infrastruktur Sirius.js. Konfigurasi ini terdapat di bagian `request` dan terdiri dari beberapa field :
- Limit (Seberapa besar batas pengiriman paket dari client ke server)
- Show POST (Boolean apakah field POST yang dikirim dari client disertakan dalam response server (debugging only))
- Show GET (Boolean apakah field GET yang dikirim dari client disertakan dalam response server (debugging only))

#### Session
Konfigurasi ini mengatur session dalam server. Konfigurasi ini terdapat di bagian `session` dan terdiri dari beberapa field :
- Secret (String rahasia yang akan dipakai sebagai kunci untuk enkripsi session)
- MaxAge (Total waktu maksimum suatu session disimpan di server dalam milidetik)

#### Folders
Konfigurasi ini mengatur folder tempat file-file core berada. Konfigurasi ini terdapat di bagian `folders` dan terdiri dari beberapa field :
- Routes (Folder route)
- Models (Folder model)

#### Database
Konfigurasi database berhubungan dengan bagaimana Sirius.js berkomunikasi dengan server database. Konfigurasi ini terdapat di bagian `database` dan terdiri dari beberapa field :
- Host (Hostname/Domain/IP tempat server database berjalan)
- User (Username untuk otentikasi database)
- Password (Password untuk otentikasi database)
- Database (Nama database default untuk koneksi yang berjalan)
- Port (Port tempat berjalannya service database ke host yang sudah ditentukan)
- Dialect (Engine/Driver database => `'mysql'`|`'sqlite'`|`'postgres'`|`'mssql'`)

#### Encryption
Konfigurasi ini mengatur bagaimana enkripsi berjalan. Konfigurasi ini terdapat di bagian `encryption` dan terdiri dari beberapa field :
- Salt Rounds (Salt yang dipakai untuk enkripsi ([baca](https://stackoverflow.com/questions/46693430/what-are-salt-rounds-and-how-are-salts-stored-in-bcrypt?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa)))

#### Migration
Konfigurasi yang mengatur migrasi database dan sinkronisasi model. Terdapat di bagian `migration` dan terdiri dari beberapa field :
- Watch (Boolean apakah perubahan field model langsung di terapkan di database setiap server berjalan/restart)
- Renew (Boolean apakah semua definisi tabel di-drop dan di buat baru di database setiap server berjalan/restart)

#### Environment
Konfigurasi tentang lingkungan aplikasi. Terdapat di bagian `environment` dan bernilai `development` (untuk server dalam masa pengembangan) dan `production` (untuk server siap pakai)

#### CORS
Konfigurasi ini mengatur pre-flight request dan origin tempat dia berasal. Terdapat di bagian `cors` dan dapat bernilai suatu string nama domain/ip address, asterisk `*` (artinya semua domain disetujui) atau array yang berisi string domain/ip address yang diizinkan.

## Dokumentasi
***
Bagian ini menjelaskan beberapa konsep fundamental yang dipakai framework ini untuk mengembangkan aplikasi

#### Routes
Route adalah suatu poin dalam aplikasi yang akan dieksekusi ketika user melakukan hit pada suatu endpoint yang sudah ditentukan untuk poin tersebut. Pikirkan route seperti sebuah controller yang menjadi penghantara antara user untuk berinteraksi dengan data-layer.
Secara default, routes didefinisikan terpisah dalam tiap file dalam folder `routes` (folder ini dapat dirubah di `./config.json` (baca konfigurasi)).
File routes adalah module CommonJS yang mengeksport fungsi yang mereturn object [`express.Router`](https://expressjs.com/en/api.html#express.router). Baca [Express Routing](https://expressjs.com/en/guide/routing.html) untuk mempelajari lebih lanjut konsep router ExpressJS
Contoh fungsi router memiliki struktur seperti ini
```javascript
/**
 * Api routes (./routes/api.js)
 */
import models from "../models";

function api(app, socketListener) {
    let router = app.get("express").Router();

    /**
     * Router disini..
     */
    router.get("/index", (req, res) => {
        res.setStatus(res.OK);
        res.setData("Hello world!");
        res.go();
    });
    
    router.get("/users", async (req, res) => {
        res.setStatus(res.OK);
        res.setData(await models.user.findAll());
        res.go();
    });
    
    return router;
}

module.exports = api;
```
Fungsi router ini akan menerima 2 parameter yaitu `app` (instance dari object [express](https://expressjs.com/en/api.html#express) app), dan `socketListener` (object dari listener websocket `./websocket/listener.js`).
Framework sudah otomatis meng-_attach_ object express dalam app sebagai constant. Object express itu dipakai untuk mengambil object `Router` yang akan dipakai untuk mendefinisikan enpoint-endpoint yang akan dipakai dalam aplikasi.
Konsep untuk mendefiniskan endpoint adalah sebagai berikut :
1. Setiap file router mendefinisikan satu `basepoint` berdasarkan nama filenya.
2. `basepoint` adalah segment pertama dari URI
3. `endpoint` adalah segment kedua dari URI. Ditentukan berdasarkan route yang didefinisikan dalam router.
4. Jika diasumsikan framework berjalan di _local machine_, menggunakan port default (8080) dan definisi route seperti pada contoh diatas (`./routes/api.js`) maka:
    - Akses : `http://localhost:8080`
    - Basepoint : `/api` (sesuai dengan nama file routes tanpa ekstensi `api.js`)
    - Endpoint :
        - `/index`
        - `/users`
    - Dengan demikian, maka daftar full URI `endpoint` yang tersedia dengan contoh sejauh ini adalah :

        | HTTP Verb | Basepoint | Endpoint | URI                             |
        |-----------|-----------|----------|---------------------------------|
        | GET       | /api      | /index   | http://localhost:8080/api/index |
        | GET       | /api      | /users   | http://localhost:8080/api/users |

5. Tentang parameter, query, body menggunakan metode yang sama dengan [ExpressJS](https://expressjs.com/en/api.html#express)

