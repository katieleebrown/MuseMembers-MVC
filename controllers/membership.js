const Membership = require('../models/Membership');
const Museum = require('../models/Museum');
const axios = require('axios');

module.exports = {
    // need to add to that membership id loop - call museum collection with the placeid to get details to send with the request
    getMemberships: async (req, res) => {
        try {
            let currentDate = new Date()
            let oneMonth = new Date()
            oneMonth = oneMonth.setMonth(oneMonth.getMonth() + 1)

            const membershipCards = await Membership.find({ userId: req.user.id })
            const museum_ids = membershipCards.map(items => items.place_id)

            const museums = await Museum.find({ place_id: museum_ids })

            membershipCards.forEach(card => {
                card.expired = (new Date(card.expirationDate).getTime() < currentDate.getTime()) ? true : false;
                card.expiringSoon = (new Date(card.expirationDate).getTime() < new Date(oneMonth).getTime()) ? true : false;
            })

            res.render('dashboard.ejs', { memberships: membershipCards, museums: museums })
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
        // Format date correctly to be parsed by new Date()
        let dateFormat = (req.body.expiration).split('-').join('/')
        try {
            await Membership.create({
                museumName: req.body.chooseMuseum,
                maxGuests: req.body.maxGuests,
                expirationDate: new Date(dateFormat).toDateString(),
                userId: req.user.id,
                place_id: req.body.place_id
            })
            console.log('Membership has been added!')
            res.redirect('/membership')
        } catch (err) {
            console.log(err)
        }
    },
    getOneMembership: async (req, res) => {
        try {
            const membership = await Membership.findById(req.params.id);
            res.render("membership.ejs", { membership: membership, user: req.user });
        } catch (err) {
            console.log(err);
        }
    },
    updateMembership: async (req, res) => {
        let dateFormat = (req.body.expiration).split('-').join('/')
        try {
            await Membership.findOneAndUpdate({ _id: req.params.id }, {
                expirationDate: new Date(dateFormat).toDateString(),
                maxGuests: req.body.maxGuests,
            }, {
                new: true,
                runValidators: true
            })
            res.redirect('/membership')
        } catch (err) {
            console.log(err);
        }
    },
    deleteMembership: async (req, res) => {
        try {
            await Membership.findOneAndDelete({ _id: req.params.id })
            console.log('Deleted Membership')
            res.redirect("/membership")
        } catch (err) {
            console.log(err)
        }
    },
}