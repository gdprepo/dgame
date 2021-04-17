const redis = require("redis");
const mongoose = require("mongoose");

const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT);


module.exports = client;
