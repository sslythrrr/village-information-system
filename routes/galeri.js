const express = require('express');
const multer = require('multer');
const { compressImage, processImages } = require('../utils/imageProcessor');
const { handleError, handleSuccess } = require('../utils/responseHandler');

module.exports = (db, requireAuth) => {
  const router = express.Router();
  const upload = multer({ storage: multer.memoryStorage() });

  router.get('/', (req, res) => {
    const sql = 'SELECT id, title, galeri_img, kategori FROM galeri ORDER BY created_at DESC';
    
    db.query(sql, (err, results) => {
      if (err) return res.status(500).send('Internal Server Error');
      res.render('galeri', { images: processImages(results, 'galeri_img') });
    });
  });

    router.get('/categories', (req, res) => {
    db.query('SELECT DISTINCT kategori FROM galeri', (err, results) => {
      if (err) return handleError(res, err);
      res.json(results.map(row => row.kategori));
    });
  });

    router.get('/admin/all', requireAuth, (req, res) => {
    const sql = 'SELECT id, title, galeri_img, kategori, created_at FROM galeri ORDER BY created_at DESC';
    
    db.query(sql, (err, results) => {
      if (err) return handleError(res, err);
      res.json(processImages(results, 'galeri_img'));
    });
  });

    router.post('/admin/add', requireAuth, upload.single('image'), async (req, res) => {
    try {
      const { title, kategori } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
      }
      
      const compressedImage = await compressImage(req.file.buffer);
      
      db.query('INSERT INTO galeri (title, galeri_img, kategori) VALUES (?, ?, ?)',
        [title, compressedImage, kategori],
        (err) => {
          if (err) return handleError(res, err);
          res.redirect('/admin/dashboard');
        }
      );
    } catch (error) {
      handleError(res, error, 'Error processing image');
    }
  });

    router.delete('/admin/delete/:id', requireAuth, (req, res) => {
    db.query('DELETE FROM galeri WHERE id = ?', [req.params.id], (err) => {
    if (err) return handleError(res, err);
    handleSuccess(res);
  });
});

  return router;
};
