/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "awvmr8lc4ps2rdy",
    "created": "2024-11-29 14:24:29.515Z",
    "updated": "2024-11-29 14:24:29.515Z",
    "name": "shortened_urls",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "avubdntp",
        "name": "original_url",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "czfcm3pe",
        "name": "short_code",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "rycypsep",
        "name": "clicks",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("awvmr8lc4ps2rdy");

  return dao.deleteCollection(collection);
})
