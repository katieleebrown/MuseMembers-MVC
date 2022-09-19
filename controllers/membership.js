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
            console.log(currentDate, oneMonth)
            const membershipCards = await Membership.find({ userId: req.user.id })
            // forEach goes through membershipCards to add expired true/false and expiring soon true/false because status depends on your date.
            membershipCards.forEach(card => {
                card.expired = (new Date(card.expirationDate).getTime() < currentDate.getTime()) ? true : false;
                card.expiringSoon = (new Date(card.expirationDate).getTime() < new Date(oneMonth).getTime()) ? true : false;
            })
            // const itemsLeft = await Todo.countDocuments({ userId: req.user.id, completed: false })
            res.render('dashboard.ejs', { memberships: membershipCards }) //, left: itemsLeft, user: req.user
        } catch (err) {
            console.log(err)
        }
    },
    createMembership: async (req, res) => {
        // Get place_id from form submission
        let selectedPlace_id = req.body.place_id

        // Sets up variables for the google place details API call
        const config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${selectedPlace_id}&fields=name,formatted_address,formatted_phone_number,opening_hours,website&key=${process.env.VITE_GOOGLE_MAPS_API_KEY}`,
            headers: {}
        };

        // this actually makes the api call, if the place_id is not one of our partner museums
        // Feature goal - eventually partner museums will have the ability to access & update their own information
        if (selectedPlace_id != '01' | selectedPlace_id != '02' | selectedPlace_id != '03' | selectedPlace_id != '04') {
            axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                    Museum.findOneAndUpdate(selectedPlace_id, {
                        museumName: response.data[0].result.name,
                        place_id: selectedPlace_id,
                        phone_number: response.data[0].result.formatted_phone_number,
                        formatted_address: response.data[0].result.formatted_address,
                        hours: response.data[0].result.opening_hours.weekday_text,
                        website: response.data[0].result.website,
                    }, { upsert: true })
                    console.log('A new museum has been added or existing updated.')
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        // Once we've updated/created the museum, create the membership (linking to that Id)
        try {
            await Membership.create({
                museumName: req.body.chooseMuseum,
                maxGuests: req.body.maxGuests,
                expirationDate: new Date(req.body.expiration).toDateString(),
                userId: req.user.id,
                place_id: req.body.place_id
            })
            console.log('Membership has been added!')
            // res.redirect('/membership')
        } catch (err) {
            console.log(err)
        }
    },
    deleteMembership: async (req, res) => {
        console.log(req.body.todoIdFromJSFile)
        try {
            await Todo.findOneAndDelete({ _id: req.body.todoIdFromJSFile })
            console.log('Deleted Todo')
            res.json('Deleted It')
        } catch (err) {
            console.log(err)
        }
    }
};

// markComplete: async (req, res) => {
//     try {
//         await Todo.findOneAndUpdate({ _id: req.body.todoIdFromJSFile }, {
//             completed: true
//         })
//         console.log('Marked Complete')
//         res.json('Marked Complete')
//     } catch (err) {
//         console.log(err)
//     }
// },
// markIncomplete: async (req, res) => {
//     try {
//         await Todo.findOneAndUpdate({ _id: req.body.todoIdFromJSFile }, {
//             completed: false
//         })
//         console.log('Marked Incomplete')
//         res.json('Marked Incomplete')
//     } catch (err) {
//         console.log(err)
//     }
// },