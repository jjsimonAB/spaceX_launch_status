const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.send('login')
})

router.get('/register', (req, res) => {
    res.send('login')
})

router.post('/register', (req, res) => {
    console.log(req.body);

    res.send('oli');
})



module.exports = router;