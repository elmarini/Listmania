const Item = require('./itemModel');
const path = require('path');

const itemController = {};

itemController.getAllItems = (req, res) => {
  Item.find({}, (err, items)=> {
      res.send(items);
  });
};

itemController.addItem = (req, res) => {
    console.log("ADDING ITEM", req.body);
    let item = new Item({name: req.body.name,  pic: req.body.pic });
    item.save((err)=> {
        if(err) {
            res.status(400);
            res.send(err);
            return;
        }
        res.status(200).send(item);
    })
};

itemController.updateItem = (req, res, next) => {
    console.log("UPDATE ITEM", req.body.itemName, "NEW STATE",req.body.newState );
    Item.findOneAndUpdate({ name: req.body.itemName }, req.body.newState, (err, item) => {
        res.result = item;
        next();
        return;
    })
    next();
}

itemController.deleteItem = (req, res, next) => {
    console.log("DELETE ITEM", req.body.itemName );
    Item.findOneAndRemove({ name: req.body.itemName }, (err, item) => {
        res.result = item;
        next();
        return;
    })
    next();
}




module.exports = itemController;