const router = require('express').Router()

router.get('/', (req, res) => {
    res.send({
        msg: 'discord',
    })
})


module.exports = router;