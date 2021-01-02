const router = require('express').Router()
const passport = require('passport');
const { route } = require('./discord');

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/redirect', passport.authenticate('discord'), (req, res) => {
        if(req.user){
        res.send(req.user)
        } else{
            res.sendStatus(401).send({msg: "Unauthorized"})
        }

});

router.get('/', (req, res) => {
})

module.exports = router;