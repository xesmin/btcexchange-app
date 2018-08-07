import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import Database from '../controllers/databaseController';

const transactionSchema = new mongoose.Schema({
 id: Number,
 type: String,
 owner: Number,
 client: Number,
 units: Number,
 price: Number,
 status: String
});

autoIncrement.initialize(Database);
transactionSchema.plugin(autoIncrement.plugin, {
    model: 'Transaction',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});


module.exports = mongoose.model('Transaction', transactionSchema);