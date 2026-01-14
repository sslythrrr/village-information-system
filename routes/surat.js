const express = require('express');
const { handleError } = require('../utils/responseHandler');

module.exports = (db, requireAuth) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.render('pengajuansurat');
  });

  router.post('/', (req, res) => {
  const { nama, perihal, staf, telepon, keterangan } = req.body;
  
  db.query('INSERT INTO surat (nama, perihal, staf, telepon, keterangan) VALUES (?, ?, ?, ?, ?)',
    [nama, perihal, staf, telepon, keterangan],
    (err) => {
      if (err) throw err;
      res.redirect('/pengajuansurat');
    }
  );
});

router.get('/admin/all', requireAuth, (req, res) => {
  db.query('SELECT * FROM surat ORDER BY created_at DESC', (err, results) => {
    if (err) return handleError(res, err);
    res.json(results);
  });
});

  return router;
};
