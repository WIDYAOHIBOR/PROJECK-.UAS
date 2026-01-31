const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// middleware baca JSON
app.use(express.json());

// ROOT
app.get('/', (req, res) => {
  res.send('API Perpustakaan Jalan');
});

// LOGIN
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === '123') {
    const token = jwt.sign(
      { username },
      'secretkey',
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login berhasil',
      token
    });
  } else {
    res.status(401).json({
      message: 'Login gagal'
    });
  }
});

// JWT MIDDLEWARE
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({
      message: 'Token tidak ada'
    });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: 'Token tidak valid'
      });
    }

    req.user = decoded;
    next();
  });
}

// USERS
app.get('/users', verifyToken, (req, res) => {
  res.json({
    users: []
  });
});

app.post('/users', verifyToken, (req, res) => {
  const { name, email } = req.body;

  res.json({
    message: 'User berhasil ditambahkan',
    data: {
      name,
      email
    }
  });
});

// SERVER
app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});
