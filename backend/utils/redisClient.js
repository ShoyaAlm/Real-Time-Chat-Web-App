const redis = require('redis')

const client = redis.createClient()


// client.on('error', (err) => console.log('Redis Client error: ', err))
client.on('error', (err) => console.log('Redis Client error:', err));


(async () => {
    await client.connect()
    console.log('Redis Client connected');
    
})();

module.exports = client