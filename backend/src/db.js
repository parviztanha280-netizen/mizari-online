const Database=require("better-sqlite3"),fs=require("fs"),path=require("path");
const dir=path.join(__dirname,"..","data");fs.mkdirSync(dir,{recursive:true});
const db=new Database(path.join(dir,"mizari.db"));
db.pragma("journal_mode=WAL");db.pragma("foreign_keys=ON");
db.exec(`
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,phone TEXT UNIQUE NOT NULL,role TEXT NOT NULL DEFAULT 'passenger',name TEXT DEFAULT '',created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS drivers(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER UNIQUE NOT NULL,vehicle_type TEXT DEFAULT 'sedan',vehicle_model TEXT DEFAULT '',vehicle_color TEXT DEFAULT '',plate TEXT DEFAULT '',verified INTEGER DEFAULT 0,online INTEGER DEFAULT 0,lat REAL,lng REAL,earnings REAL DEFAULT 0,FOREIGN KEY(user_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS rides(id INTEGER PRIMARY KEY AUTOINCREMENT,passenger_id INTEGER NOT NULL,driver_id INTEGER,origin_text TEXT NOT NULL,destination_text TEXT NOT NULL,origin_lat REAL,origin_lng REAL,destination_lat REAL,destination_lng REAL,distance_km REAL DEFAULT 0,duration_min REAL DEFAULT 0,fare REAL DEFAULT 0,status TEXT DEFAULT 'requested',payment_method TEXT DEFAULT 'cash',created_at TEXT DEFAULT CURRENT_TIMESTAMP,updated_at TEXT DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(passenger_id) REFERENCES users(id),FOREIGN KEY(driver_id) REFERENCES drivers(id));
CREATE TABLE IF NOT EXISTS ratings(id INTEGER PRIMARY KEY AUTOINCREMENT,ride_id INTEGER UNIQUE NOT NULL,from_user_id INTEGER NOT NULL,to_user_id INTEGER NOT NULL,score INTEGER NOT NULL,comment TEXT DEFAULT '',created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS complaints(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL,ride_id INTEGER,category TEXT NOT NULL,message TEXT NOT NULL,status TEXT DEFAULT 'open',created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS push_subscriptions(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL UNIQUE,subscription_json TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP,updated_at TEXT DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(user_id) REFERENCES users(id));
`);
module.exports=db;