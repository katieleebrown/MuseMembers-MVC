const express = require('express')
const router = express.Router()
const membershipController = require('../controllers/membership')
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, membershipController.getMemberships)

router.get("/seeMembership/:id", membershipController.getOneMembership)

router.post('/createMembership', membershipController.createMembership)

router.delete('/deleteMembership/:id', membershipController.deleteMembership)

module.exports = router

//router.put('/markComplete', todosController.markComplete)
//router.put('/markIncomplete', todosController.markIncomplete)