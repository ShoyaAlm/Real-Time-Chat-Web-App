const express = require('express');

const app = express();


const port = 8080

app.get('/', (req, res) => {
    res.status(200).send('We are LIVE!')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
