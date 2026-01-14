const express = require('express');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql2');

const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'desa_tegal'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

const requireAuth = (req, res, next) => {
  if (req.session.isAdmin) {
    return next();
  }
  res.redirect('/');
};

const attachUser = (req, res, next) => {
  res.locals.isAdmin = req.session.isAdmin || false;
  res.locals.username = req.session.username || null;
  next();
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-secret-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(attachUser);

const adminRoutes = require('./routes/admin')(db, requireAuth);
const beritaRoutes = require('./routes/berita')(db, requireAuth);
const galeriRoutes = require('./routes/galeri')(db, requireAuth);
const pengumumanRoutes = require('./routes/pengumuman')(db, requireAuth);
const aspirasiRoutes = require('./routes/aspirasi')(db, requireAuth);
const suratRoutes = require('./routes/surat')(db, requireAuth);
const pagesRoutes = require('./routes/pages')(db);

app.use('/admin', adminRoutes);
app.use('/berita', beritaRoutes);
app.use('/galeri', galeriRoutes);
app.use('/pengumuman', pengumumanRoutes);
app.use('/aspirasi', aspirasiRoutes);
app.use('/pengajuansurat', suratRoutes);
app.use('/', pagesRoutes);

app.use((req, res) => {
  res.status(404).send('Page not found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
