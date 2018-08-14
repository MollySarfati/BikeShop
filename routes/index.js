var express = require('express');
var router = express.Router();

var stripe = require("stripe")("sk_test_CYvqefVy8xAD0HkSxGjXab5v");

/* GET home page. */
router.get('/', function(req, res, next) {
  var dataBike = [
                    {name: "Model BIKO45", url:"/images/bike-1.jpg", price: 679},
                    {name: "Model ZOOK7", url:"/images/bike-2.jpg", price: 799},
                    {name: "Model LIKO89", url:"/images/bike-3.jpg", price: 839},
                    {name: "Model GEWO", url:"/images/bike-4.jpg", price: 1206},
                    {name: "Model TITAN5", url:"/images/bike-5.jpg", price: 989},
                    {name: "Model AMIG39", url:"/images/bike-6.jpg", price: 599}

];

if (req.session.dataCardBike==undefined){
  req.session.dataCardBike=[];
}

  res.render('index', {dataBike: dataBike});
});



router.post('/add-card', function(req, res, next) {
  req.session.dataCardBike.push(req.body);
  res.render('card', { dataCardBike: req.session.dataCardBike });
})



router.post('/update-card', function(req, res, next) {
  req.session.dataCardBike[req.body.position].quantity = req.body.quantity;
  res.render('card', { dataCardBike : req.session.dataCardBike});
})



router.get('/delete-card', function(req, res, next) {
  console.log(req.body);
  req.session.dataCardBike.splice(req.query.position, 1);
  res.render('card', { dataCardBike:  req.session.dataCardBike});
})

router.get('/card', function(req, res, next) {
  res.render('card', { dataCardBike: req.session.dataCardBike });
});

router.get('/inscription', function(req, res, next) {
  res.render('inscription', { title: "Bonjour" });
});


router.post('/inscription', function(req, res, next) {
      req.session.nom = req.body.nom;
      res.render("confirmation-inscription", { name: req.session.nom });
});


//STRIPE
// npm install --save stripe
router.post("/checkout", function(req, res, next){

  var totalCmd = 0;
  for(var i=0; i<req.session.dataCardBike.length; i++) {
      totalCmd = totalCmd + (req.session.dataCardBike[i].price*req.session.dataCardBike[i].quantity);
    };

     totalCmd=totalCmd*100

  const token = req.body.stripeToken;
  const charge = stripe.charges.create({
      amount: totalCmd,
      currency: 'eur',
      description: 'Example charge',
      source: token,
          });

res.render ("confirmation-paiement",{})
});


module.exports = router;
