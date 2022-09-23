const cloudinary = require("../middleware/cloudinary");
const Membership = require('../models/Membership');
const Museum = require('../models/Museum');
const axios = require('axios');
const User = require("../models/User")

module.exports = {
    getMemberships: async (req, res) => {
        try {
            // get date info for expiration badges
            let currentDate = new Date()
            let oneMonth = new Date()
            oneMonth = oneMonth.setMonth(oneMonth.getMonth() + 1)

            // find memberships for logged in user, then museums for those memberships
            const membershipCards = await Membership.find({ userId: req.user.id })
            const museum_ids = membershipCards.map(items => items.place_id)
            const museums = await Museum.find({ place_id: museum_ids })

            // update data sent for each membership to include expiration status
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

        // check to see if museum is already in db
        const existingMuseum = await Museum.findOne({ place_id: selectedPlace_id })

        // If museum is not a current partner AND if museum is not already in the database, create now
        if (selectedPlace_id != '01' && selectedPlace_id != '02' && selectedPlace_id != '03' && selectedPlace_id != '04') {
            await axios(config)
                .then(function (response) {
                    JSON.stringify(response.data)
                    console.log(response.data)

                    if (!existingMuseum) {
                        Museum.create({
                            museumName: req.body.chooseMuseum,
                            place_id: selectedPlace_id,
                            phone_number: response.data.result.formatted_phone_number,
                            formatted_address: response.data.result.formatted_address,
                            hours: response.data.result.opening_hours.weekday_text,
                            website: response.data.result.website,
                        })
                        console.log('A new museum has been added.')
                    } else {
                        console.log('Museum already exists in db.')
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
        }

        // Create Membership Document
        // Format date correctly to be parsed by new Date()
        let dateFormat = (req.body.expiration).split('-').join('/')

        try {
            // Upload image to Cloudinary
            // const result = await cloudinary.uploader.upload(req.file);

            await Membership.create({
                museumName: req.body.chooseMuseum,
                maxGuests: req.body.maxGuests,
                expirationDate: new Date(dateFormat).toDateString(),
                userId: req.user.id,
                place_id: req.body.place_id,
                notes: req.body.notes,
                // image: result.secure_url,
                // cloudinaryId: result.public_id,
            })
            console.log('Membership has been added.')
            res.redirect('/membership')
        } catch (err) {
            console.log(err)
        }
    },
    getOneMembership: async (req, res) => {
        // get date info for expiration badges
        let currentDate = new Date()
        let oneMonth = new Date()
        oneMonth = oneMonth.setMonth(oneMonth.getMonth() + 1)

        try {
            // find the membership from the request
            const membership = await Membership.findById(req.params.id);

            // update data sent for membership to include expiration status
            membership.expired = (new Date(membership.expirationDate).getTime() < currentDate.getTime()) ? true : false;
            membership.expiringSoon = (new Date(membership.expirationDate).getTime() < new Date(oneMonth).getTime()) ? true : false;

            res.render("membership.ejs", { membership: membership, user: req.user });
        } catch (err) {
            console.log(err);
        }
    },
    updateMembership: async (req, res) => {
        // format date
        let dateFormat = (req.body.expiration).split('-').join('/')

        // update the membership based on form inputs
        try {
            await Membership.findOneAndUpdate({ _id: req.params.id }, {
                expirationDate: new Date(dateFormat).toDateString(),
                maxGuests: req.body.maxGuests,
            }, {
                new: true,
                runValidators: true
            })
            // redirect back to dashboard
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
    getNearbyMuseums: async (req, res) => {
        try {
            // get user info for nearby museum recommendations
            const user = await User.find({ _id: req.user.id })
            const addressStr = `${user[0].address}, ${user[0].city}, ${user[0].state} ${user[0].zipcode}`

            // use address string to get lat/long from Position Stack for Google Recommendations
            let userLatitude = 0;
            let userLongitude = 0;

            // if user has an address, make the call for lat/long
            if (user[0].address.length > 0) {
                let url = `http://api.positionstack.com/v1/forward?access_key=${process.env.POSITION_STACK_ACCESS_KEY}&query=${addressStr}&limit=1`
                await fetch(url)
                    .then((response) => response.json())
                    .then((data) => {
                        userLatitude = data.data[0].latitude
                        userLongitude = data.data[0].longitude
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }

            res.render('nearbyMuseums.ejs', { userLat: userLatitude, userLon: userLongitude })
        } catch (err) {
            console.log(err)
        }
    },
}