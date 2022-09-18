const Membership = require('../models/Membership');
const Museum = require('../models/Museum');
const axios = require('axios');

module.exports = {
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
        // roadblock - node cannot access localstorage. Need a different way for additional data to be sent with the form. 
        // Could I add a hidden form input that gets the place_id added on request? So it can be accessed through req.body.place_id?
        let selectedPlace_id = req.body.place_id
        if (selectedPlace_id) {
            console.log('place_id acquired.')

            const museum = await Museum.find({ place_id: selectedPlace_id }).lean
            if (!museum) {
                const config = {
                    method: 'get',
                    url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${selectedPlace_id}&fields=name,formatted_address,formatted_phone_number,opening_hours,website&key=${process.env.VITE_GOOGLE_MAPS_API_KEY}`,
                    headers: {}
                };

                axios(config)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        // await Museum.create({

                        // })
                        console.log('A new museum has been added.')
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }

        try {
            await Membership.create({
                museumName: req.body.chooseMuseum,
                maxGuests: req.body.maxGuests,
                expirationDate: new Date(req.body.expiration).toDateString(),
                userId: req.user.id,
            })
            console.log('Membership has been added!')
            res.redirect('/membership')
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