const express = require('express');
const { processImages } = require('../utils/imageProcessor');

module.exports = (db) => {
  const router = express.Router();

  const renderIndex = (req, res, section = null) => {
    const sql = 'SELECT id, judul, LEFT(isi, 100) AS isi_singkat, gambar, DATE_FORMAT(tanggal, "%W, %d %M %Y") AS formatted_date FROM berita ORDER BY tanggal DESC LIMIT 3';
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      res.render('index', { section, berita: processImages(results) });
    });
  };

  router.get('/', (req, res) => renderIndex(req, res));
  router.get('/index', (req, res) => renderIndex(req, res));
  router.get('/index#:section', (req, res) => renderIndex(req, res, req.params.section));

  router.get('/sejarah', (req, res) => res.render('sejarah'));
  router.get('/visimisi', (req, res) => res.render('visimisi'));
  router.get('/struktur', (req, res) => res.render('struktur'));
  router.get('/demografi', (req, res) => res.render('demografi'));
  router.get('/kontak', (req, res) => res.render('kontak'));

  return router;
};
