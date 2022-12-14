const express = require('express')
const router = express.Router()
const upload = require("../middleware/multer");
const membershipController = require('../controllers/membership')
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, membershipController.getMemberships)

router.post('/createMembership', upload.single("file"), membershipController.createMembership)

router.get("/seeMembership/:id", membershipController.getOneMembership)

router.put('/updateMembership/:id', membershipController.updateMembership)

router.get('/deleteMembership/:id', membershipController.deleteMembership)

router.get('/nearby', membershipController.getNearbyMuseums)

module.exports = router

//router.put('/markComplete', todosController.markComplete)
//router.put('/markIncomplete', todosController.markIncomplete)