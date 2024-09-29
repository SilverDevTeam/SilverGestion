const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db.sqlite');

db.run(`CREATE TABLE IF NOT EXISTS users (
  guildId TEXT,
  userId TEXT,
  sanction INTEGER DEFAULT 0,
  whitelist INTERGER DEFAULT 0,
  PRIMARY KEY (guildId, userId)
)`);

db.run(`CREATE TABLE IF NOT EXISTS guilds (
  guildId TEXT,
  logschannel TEXT,
  raidmode INTERGER DEFAULT 0,
  bye TEXT,
  bvn TEXT,
  ticketGap TEXT,
  ticketGs TEXT,
  ticketCrown TEXT,
  ticketCm TEXT,
  ticketStaff TEXT,
  urlSoutien TEXT,
  roleSoutien TEXT,
  PRIMARY KEY (guildId)
)`)

db.run(`CREATE TABLE IF NOT EXISTS rolePermission (
  guildId TEXT,
  roleId TEXT,
  permission INTEGER,
  PRIMARY KEY (guildId, permission)
)`);

db.run(`CREATE TABLE IF NOT EXISTS channels (
  guildId TEXT,
  channelId TEXT,
  snipe TEXT,
  snipeAuthor TEXT,
  autoreact TEXT,
  PRIMARY KEY (guildId, channelId)
)`)

module.exports = db;