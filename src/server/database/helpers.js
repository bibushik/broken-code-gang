const { ObjectId } = require('mongodb');

/**
 * @typedef {{
 *  items: T[],
 *  next: *,
 *  count: number
 * }} Pagination<T>
 */


/**
 * Create pagination
 *
 * @param {Collection} collection
 * @param filter
 */
async function pageableCollection(collection, {
    lastId, order, limit = 10, ...query
} = {},selectModifier) {
    const count = await collection.find(query).count();
    if(lastId && selectModifier){
        query._id = {
            [selectModifier]: ObjectId(lastId.toString())
        };
    }
    else if (lastId) {
        query._id = {
            $gt: ObjectId(lastId.toString())
        };
    }

    let queryBuilder = collection.find(query, { limit });

    if (order) {
        queryBuilder = queryBuilder.sort(order);
    }

    if (typeof query._id === 'string') {
        query._id = ObjectId(query._id.toString());
    }

    let cursor = await queryBuilder,
        items = await cursor.toArray(),
        next = null;

    if (items.length === limit) {
        next = {
            limit,
            order,
            lastId: items[items.length - 1]._id,
            ...query,
        };
    }

    return {
        count,
        items,
        next,
    };
}

/**
 * Create pagination
 *
 * @param {Collection} collection
 * @param {*} data
 *
 * @return {Promise<*>}
 */
async function insertOrUpdateEntity(collection, data) {
    if (data._id) {
        const result = await collection.findOneAndUpdate(
            { _id: data._id },
            data,
        );
    } else {
        const result = await collection.insertOne(data);
        data._id = result.insertedId;

        return data;
    }
}

module.exports = {
    pageableCollection,
    insertOrUpdateEntity,
};
