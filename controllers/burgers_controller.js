var db = require("../models");
var log = require("loglevel").getLogger("burgers_controller");

module.exports = function(app) {
 
  app.get("/", function(req, res) {
    log.debug("___ENTER GET /___");

    db.Burger.findAll({
      include: [ db.Customer ],
      order: "name ASC"
    })
    .then(function(data) {
      log.debug("data = " + JSON.stringify(data));

      var hbsObject = {
        burgers: data
      };
      console.log(hbsObject);
      res.render('index', hbsObject);
    })
    .catch(function(err) {
      log.error("ERR = " + err);
      res.json({status: "ERROR", message: err});
    });
  });

 
  app.post("/burgers", function(req, res) {
    log.debug("___ENTER POST /burgers___");

    db.Burger.create(req.body)
    .then(function(burger) {
      res.redirect("/");
    })
    .catch(function(err) {
      log.error("ERR = " + err);
      res.json({status: "ERROR", message: err});
    });
  });

 
  app.put("/burgers/:id", function(req, res) {
    log.debug("___ENTER PUT /burgers:id___");

    log.debug("id = " + req.params.id);
    log.debug("customer = " + JSON.stringify(req.body.customerName));

    var burgerID = req.params.id;
    var customerName = req.body.customerName;

    db.Customer.findAll({
      where: {
        name: customerName
      }
    })
    .then(function(customer) {
 
      if (customer.length === 0) {
        log.debug("customer does not exist!");

 
        db.Customer.create({
          name: customerName
        })
        .then(function(newCustomer) {
          log.debug("customer created = " + JSON.stringify(newCustomer));

 
          db.Burger.update(
            {
              devoured: true,
              CustomerId: newCustomer.id
            },
            {
              where: {
                id: req.params.id
              }
            }
          ).then(function(burger) {
            res.redirect('/');
          })
          .catch(function (err) {
            log.error("ERR = " + err);
            res.json({status: "ERROR", message: err});
          });
        })
        .catch(function(error) {
          log.debug("ERROR: Error on customer create -- " + JSON.stringify(error));
          res.json({status: "ERROR", message: error});
        })
      } else { 
        log.debug("customer exists = " + JSON.stringify(customer));

     
        db.Burger.update(
          {
            devoured: true,
            CustomerId: customer[0].id
          },
          {
            where: {
              id: req.params.id
            }
          }
        ).then(function(burger) {
          res.redirect('/');
        })
        .catch(function (err) {
          log.error("ERR = " + err);
          res.json({status: "ERROR", message: err});
        });
      }
    })
    .catch(function(error) {
      if(error) {
        log.debug("ERROR: Error on customer query -- " + JSON.stringify(error));
        res.json({status: "ERROR", message: error});
      }
    });
  });
};
