module.exports = {
  $jsonSchema: {
    bsonType: "object",
    required: ["_id"],

    properties: {
      _id: { bsonType: "objectId" },
    },
  },
};
