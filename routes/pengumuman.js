const express = require('express');
const { handleError, handleSuccess } = require('../utils/responseHandler');

module.exports = (db, requireAuth) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    db.query('SELECT * FROM pengumuman ORDER BY created_at DESC', (err, results) => {
      if (err) throw err;
      res.render('pengumuman', { pengumuman: results });
    });
  });

    router.get('/admin/all', requireAuth, (req, res) => {
    db.query('SELECT * FROM pengumuman ORDER BY created_at DESC', (err, results) => {
      if (err) return handleError(res, err);
      res.json(results);
    });
  });

  router.post('/admin/add', requireAuth, (req, res) => {
  const { title, content } = req.body;
  
  db.query('INSERT INTO pengumuman (title, content) VALUES (?, ?)', 
    [title, content], 
    (err) => {
      if (err) return handleError(res, err);
      res.redirect('/admin/dashboard');
    }
  );
});

  router.delete('/admin/delete/:id', requireAuth, (req, res) => {
    db.query('DELETE FROM pengumuman WHERE id = ?', [req.params.id], (err) => {
    if (err) return handleError(res, err);
    handleSuccess(res);
  });
});

  return router;
};
