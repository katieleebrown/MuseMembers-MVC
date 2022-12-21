# Introduction
MuseMembers is a full-stack web app designed to manage memberships for museums and cultural institutions. With the ability to view memberships, get alerts about upcoming expiration dates or recently lapsed memberships and recomendations on nearby cultural institutions to visit, MuseMembers is designed to get those cards out of your wallet and make planning your upcoming free time that much easier. MuseMembers also includes benefits for 'partner' museums - it allows them to share announcements with members of their institution, and in the future will include highlights for partners in the recommended section.

Take a look at the live app <a href="https://tame-lime-pig-tie.cyclic.app/">here</a>.

![screenshot of the dashboard, displaying museum cards for each membership](/images/dashboardScreenshot.JPG)

# Why It's Made
This app is heavily inspired by my time spent working with museums and cultural institutions. While museum memberships are nice, most consumers tend to limit their purchases of memberships because access is so spread out - each museum has a different card, a different website, and a different way to get updates. MuseMembers is designed to keep all of that information together, while also giving recommendations on other places to checkout nearby. The hope is that this app eventually becomes a one stop shop as you're planning your weekend, and makes it easier to get on to the fun stuff, while also increasing museum attendance.

# How It's Made
Tech Used : Javascript, Node.js, Express, MongoDB, Mongoose, Bootstrap, HTML, CSS, & Figma

At it's core, this web app is a membership database. It stores user information, links that user to their various memberships, and allows them to add, update, and remove as they need. This full-stack app took well over 100 hours (and counting) to build, with new features in the works. 

This app also relies on a few Google APIs (mostly Find Places and Places Details) to pull data on non-partner museums so users don't have to fill out long, lengthy forms each time they upload a new membership. MuseMembers also connects with the positionstack API to assist with geolocation and the nearby museums recommendation feature.

# Optimizations
In the future, I would love to start using all of the collected member information to make recommendations to our users. Ideally, the system would look at other users with at least 2 membership organizations in common with the user, and then recommend other museums or cultural institutions to check out based on that data. This would be a great add for our "Nearby Institutions" section, and would hopefully help connect our users with more exciting places.

I also have hopes for additional features for our museum partners - with the announcement system in place, it would also make sense to include a feature that displays upcoming events at member organizations for users. Ideally our system would also be able to target new future partners by pulling data of what memberships have been uploaded that aren't a part of our partnership list.

# Lessons Learned
Stay tuned! This project is still underway, and LOTS of lessons are being learned.

# Credit & Copyright
- Illustrated images for this project are from undaw.co
- Museum partners and their details, logos, and names are fictional, and created by me for this project. Logos were generated with Adobe Express.
- This site with designed and built by me, Katie Brown, but is open for new contributors. If you'd like to add to MuseMembers, let me know!

# Want to try MuseMembers locally?

- `npm i types/googlemaps axios bcrypt bootstrap cloudinary connect-mongo dotenv ejs esbuild express express-flash express-session function-bind has is-core-module method-override mongodb mongoose morgan multer nanoid nodemon npm-run-all passport passport-local path path-parse picocolors postcss resolve rimraf rollup validator vite`

- Create a `.env` file and add the following as `key: value` 
  - PORT: 8000 (can be any port example: 3000) 
  - DB_STRING: `your database URI` 
  - VITE_GOOGLE_MAPS_API_KEY: `YOUR GOOGLE API KEY`
    <small> Please note: You need to set up website restrictions and enable the Maps Javascript API and Place API in your google cloud. You will need to set up your own Google Maps Platform. </small>
