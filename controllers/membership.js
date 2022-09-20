const Membership = require('../models/Membership');
const Museum = require('../models/Museum');
const axios = require('axios');

module.exports = {
    // need to add to that membership id loop - call museum collection with the placeid to get details to send with the request
    getMemberships: async (req, res) => {
        console.log(req.user)
        try {
            let currentDate = new Date()
            let oneMonth = new Date()
            oneMonth = oneMonth.setMonth(oneMonth.getMonth() + 1)
            
            const membershipCards = await Membership.find({ userId: req.user.id })
            membershipCards.forEach(card => {
                card.expired = (new Date(card.expirationDate).getTime() < currentDate.getTime()) ? true : false;
                card.expiringSoon = (new Date(card.expirationDate).getTime() < new Date(oneMonth).getTime()) ? true : false;
            })
            
            res.render('dashboard.ejs', { memberships: membershipCards })
        } catch (err) {
            console.log(err)
        }
    },
    createMembership: async (req, res) => {
        // Get place_id from form submission
        let selectedPlace_id = req.body.place_id

        // Set up variables for the google place details API call
        const config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${selectedPlace_id}&fields=name,formatted_address,formatted_phone_number,opening_hours,website&key=${process.env.VITE_GOOGLE_MAPS_API_KEY}`,
            headers: {}
        };

        // Create Museum Document
        if (selectedPlace_id != '01' && selectedPlace_id != '02' && selectedPlace_id != '03' && selectedPlace_id != '04') {
            await axios(config)
                .then(function (response) {
                    JSON.stringify(response.data)

                    Museum.create({
                        museumName: response.data.result.name,
                        place_id: selectedPlace_id,
                        phone_number: response.data.result.formatted_phone_number,
                        formatted_address: response.data.result.formatted_address,
                        hours: response.data.result.opening_hours.weekday_text,
                        website: response.data.result.website,
                    }, { upsert: true })
                    console.log('A new museum has been added or updated.')
                })
                .catch(function (error) {
                    console.log(error);
                })
        }

        // Create Membership Document
        try {
            await Membership.create({
                museumName: req.body.chooseMuseum,
                maxGuests: req.body.maxGuests,
                expirationDate: new Date(req.body.expiration).toDateString(),
                userId: req.user.id,
                place_id: req.body.place_id
            })
            console.log('Membership has been added!')
            res.redirect('/membership')
        } catch (err) {
            console.log(err)
        }
    },
    deleteMembership: async (req, res) => {
        console.log(req.body.membershipIdFromJSFile)
        try {
            await Todo.findOneAndDelete({ _id: req.body.membershipIdFromJSFile })
            console.log('Deleted Membership')
            res.json('Deleted It')
        } catch (err) {
            console.log(err)
        }
    },
}