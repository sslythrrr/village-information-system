const express = require('express');
const { handleError } = require('../utils/responseHandler');

module.exports = (db, requireAuth) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.render('aspirasi');
  });

  router.post('/', (req, res) => {
  const { name, email, message } = req.body;
  
  db.query('INSERT INTO aspirasi (name, email, message) VALUES (?, ?, ?)',
    [name, email, message],
    (err) => {
      if (err) throw err;
      res.redirect('/aspirasi');
    }
  );
});

  router.get('/admin/all', requireAuth, (req, res) => {
    db.query('SELECT * FROM aspirasi ORDER BY created_at DESC', (err, results) => {
    if (err) return handleError(res, err);
    res.json(results);
  });
});

  return router;
};
