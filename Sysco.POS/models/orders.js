const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OrderSchema = new Schema({
    items: [{
        item: {
            type: Schema.Types.ObjectId,
            ref: 'item',
            required: true
        },
        orderamount: { type: Number,
            required: true }
    }],
    status: { type: String,
        enum : ['OPEN','CLOSE'],
        default: 'OPEN',
     },
    createdby: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }

})

const order = mongoose.model('order', OrderSchema);
module.exports = order;