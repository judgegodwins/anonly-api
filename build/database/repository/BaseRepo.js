"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../models/Message");
class BaseRepo {
    static paginate(query) {
        return {
            paginate: async function (req, res) {
                const page = parseInt(req.query.page);
                const limit = parseInt(req.query.limit);
                const startIndex = (page - 1) * limit;
                const endIndex = limit * page;
                console.log('nums: ', startIndex, ' ', endIndex, ' ', limit, ' ', page);
                const docCount = await Message_1.MessageModel.countDocuments(query);
                const result = {};
                console.log('count, pneces ', docCount, docCount / limit);
                result.pagesNecessary = Math.ceil(docCount / limit);
                console.log('paginating...');
                result.data = await query.skip(startIndex).limit(limit).lean();
                if (endIndex < docCount) {
                    result.next = {
                        page: page + 1,
                        limit
                    };
                }
                if (startIndex > 0) {
                    result.previous = {
                        page: page - 1,
                        limit
                    };
                }
                return result;
            }
        };
    }
}
exports.default = BaseRepo;
//# sourceMappingURL=BaseRepo.js.map