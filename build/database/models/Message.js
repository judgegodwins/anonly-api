"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = 'Message';
exports.COLLECTION_NAME = 'messages';
const schema = new mongoose_1.Schema({
    text: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true });
schema.query.paginate = async function (page, limit) {
    const startIndex = (page - 1) * limit;
    const newQuery = this.limit(limit).skip(startIndex);
    const count = await this.model.countDocuments(this);
    return newQuery;
};
exports.MessageModel = mongoose_1.model(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
//# sourceMappingURL=Message.js.map