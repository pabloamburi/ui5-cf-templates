const cds = require("@sap/cds");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const uri = process.env.URIMONGODB;
const db_name = "ERPData";
const client = new MongoClient(uri, { useUnifiedTopology: true });
var response;

async function _CreateOrders(req){

    // Connect the client to the server
    await client.connect();

    // Establish and verify connection
    var db = await client.db(db_name);

    //Connect to Collection
    var collection_Orders = await db.collection("Orders");

    var data = req.data;
    //Input date format as string - like 2020-02-04T05:06:18.417Z
    data.OrderCreatedOn = new Date(data.OrderCreatedOn);

    var results = await collection_Orders.insertOne(data);
    if ((results.insertedCount = 1)) {
        var temp_date = data.OrderCreatedOn;
        data.OrderCreatedOn = temp_date.getFullYear() + "-" + temp_date.getMonth() + "-" +
            temp_date.getDate() + "T" + temp_date.getHours() + ":" +
            temp_date.getMinutes() + ":" + temp_date.getSeconds() +
            "." + temp_date.getMilliseconds() + "Z";
        delete data._id;
        return data;
    } else {
        console.log(results.result);
        return results.result;
    }

}

async function _getMaterialInfo(req){

    // Connect the client to the server
    await client.connect();

    // Establish and verify connection
    var db = await client.db(db_name);

    //Connect to Collection
    var collection_material = await db.collection("Materials");

    var filter, projection, Material, results;

    //If input Material is passed then
    if (req.params.length > 0) {
        Material = req.params[0].Material;
    }

    //Get all Material details
    if (Material !== undefined) {
        filter = { Material: Material };
        projection = {
            _id: 0,
        };
        results = await collection_images
            .find(filter, { projection: projection })
            .toArray();
        for (var i in results) {
            var str = results[i].ImageData;
            results[i].ImageData = results[i].ImageData.buffer.toString("base64");
        }
    } else {
        results = "Please Enter Material";
    }
    return results;

}

async function _getOrders(req) {
    // Connect the client to the server
    await client.connect();

    // Establish and verify connection
    var db = await client.db();

    //Connect to Collection
    var collection_Orders = await db.collection("Orders");

    var filter, projection, results, date_high, date_low;

    console.log(req.query);

    //Make sure date_low and date_high are in format 2020-02-04T05:06:18.417Z
    //but not as 2020-2-4T5:6:18.417Z
    if (req.query.SELECT.where !== undefined) {
        date_low = req.query.SELECT.where[2].val;
        date_high = req.query.SELECT.where[6].val;
    }

    if (date_low !== undefined) {
        var MyCurLowDate = new Date(date_low);
        var MyCurHighDate = new Date(date_high);
        filter = { OrderCreatedOn: { $gte: MyCurLowDate, $lte: MyCurHighDate } };
    } else {
        filter = {};
    }

//Do not Select ID
//Select OrderCreatedOn in format yyyy-mm-ddThh:mm:ss:lll+z
//Mention all other fields which need to be selected
    projection = {
        _id: 0,
        OrderCreatedOn: {
            $dateToString: {
                format: "%Y-%m-%dT%H:%M:%S.%LZ",
                date: "$OrderCreatedOn",
            },
        },
        orderNo: 1,
        ItemNo: 1,
        Material: 1,
        Quantity: 1,
        QUOM: 1,
        Price: 1,
        Currency: 1,
    };

    var results = await collection_Orders
        .find(filter, { projection: projection })
        .toArray();

//return results as output
    return results;
}


module.exports = cds.service.impl(function() {
    const { Orders, Materials } = this.entities;

    //For Orders
    this.on("READ", Orders, _getOrders);
    this.on("CREATE", Orders, _CreateOrders);

    //For Materials
    this.on("READ", Materials, _getMaterialInfo);
});