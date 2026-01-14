const express = require('express');
const multer = require('multer');
const { compressImage, processImages, bufferToBase64 } = require('../utils/imageProcessor');
const { handleError, handleSuccess } = require('../utils/responseHandler');

module.exports = (db, requireAuth) => {
  const router = express.Router();
  const upload = multer({ storage: multer.memoryStorage() });

  router.get('/', (req, res) => {
    const sql = 'SELECT id, judul, LEFT(isi, 200) AS isi_singkat, gambar, tanggal FROM berita ORDER BY tanggal DESC';
    
    db.query(sql, (err, results) => {
      if (err) return handleError(res, err);
      res.render('berita', { berita: processImages(results) });
    });
  });

    router.get('/:id', (req, res) => {
    db.query('SELECT * FROM berita WHERE id = ?', [req.params.id], (err, results) => {
      if (err) return res.status(500).send('Internal Server Error');
      
      if (results.length === 0) {
        return res.status(404).send('Berita not found');
      }
      
      const berita = results[0];
      if (berita.gambar) berita.gambar = bufferToBase64(berita.gambar);
      
      res.render('berita-detail', { berita });
    });
  });

    router.get('/admin/all', requireAuth, (req, res) => {
    const sql = 'SELECT id, judul, LEFT(isi, 200) AS isi_singkat, tanggal FROM berita ORDER BY tanggal DESC';
    
    db.query(sql, (err, results) => {
      if (err) return handleError(res, err);
      res.json(results);
    });
  });

    router.get('/admin/:id', requireAuth, (req, res) => {
    db.query('SELECT * FROM berita WHERE id = ?', [req.params.id], (err, results) => {
      if (err) return handleError(res, err);
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Berita not found' });
      }
      
      const berita = results[0];
      if (berita.gambar) berita.gambar = bufferToBase64(berita.gambar);
      
      res.json(berita);
    });
  });

    router.post('/admin/add', requireAuth, upload.single('gambar'), async (req, res) => {
    try {
      const { judul, isi } = req.body;
      const compressedImage = req.file ? await compressImage(req.file.buffer) : null;
      
      db.query('INSERT INTO berita (judul, isi, gambar) VALUES (?, ?, ?)', 
        [judul, isi, compressedImage], 
        (err) => {
          if (err) return handleError(res, err);
          res.redirect('/admin/dashboard');
        }
      );
    } catch (error) {
      handleError(res, error);
    }
  });

  router.delete('/admin/delete/:id', requireAuth, (req, res) => {
    db.query('DELETE FROM berita WHERE id = ?', [req.params.id], (err) => {
      if (err) return handleError(res, err);
      handleSuccess(res);
    });
  });

  return router;
};
