const express = require('express');
const bcrypt = require('bcryptjs');
const { handleError, handleSuccess } = require('../utils/responseHandler');

module.exports = (db, requireAuth) => {
  const router = express.Router();

  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    db.query('SELECT * FROM admin WHERE username = ?', [username], (err, results) => {
      if (err) return handleError(res, err, 'Login failed');
      
      if (results.length === 0) {
        return res.json({ success: false, message: 'Invalid credentials' });
      }
      
      const isValid = bcrypt.compareSync(password, results[0].password);
      
      if (isValid) {
        req.session.isAdmin = true;
        req.session.username = username;
        return res.json({ success: true, message: 'Login successful' });
      }
      
      res.json({ success: false, message: 'Invalid credentials' });
    });
  });

  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) console.error('Logout error:', err);
      res.redirect('/');
    });
  });

  router.get('/dashboard', requireAuth, (req, res) => {
    res.render('admin_dashboard');
  });

  return router;
};
