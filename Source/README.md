## TASK/SPEC

- Create a website that will allow users to upload and view the images that they have uploaded. Implement a sorting function for the images.

1. Create a user authentication DONE
2. Create a landing page where user can view theirs or any other users images
3. Allow images to be sorted by name or by date uploaded
4. Allow comments on images and display name of the user that posted the comment
5. Allow user to edit the name of the image they’ve uploaded
6. Create image search

- Load images as thumbnails and load higher image resolution on click only

## TECH

- Images Upload - Back end - turns out I could have done this easliy on front end but mainly to be able to interact with db as needed here (see below or more on why this is back end)
- Images Storage and other - `Firebase Storage`, `Realtime DB`, and `Firebase Cloud Functions` see `Source/client/functions/index.js` - all front end
- Front End Style/UI package = `MATERIAL UI` - hey why not - well maintained package with small amount of downside(potential bugs/inflexible) but I like the crisp clean modern looks and components offered.
- `React` SPA with using Hooks and Context API
- `Node.js` Server
- AUTH - `mySQL`, `Passport.js-local`, `Bcrypt`, etc.

## SQL Notes: Explain just in case using Firebase the way I did was too much focus on Firebase not enough on SQL.

- I was originally using Image Table `/models/image` to store the PUBLIC viewable URL, creating an entry on upload, which sadly was not stored in the bucket (like I anticipated from past exp with Azure buckets). I used a JOIN to bring back all images for the particular user. Those are the essentials for SQL.
- I used SQL for my AUTH set up. Sign Up and User info.
- I used an ORM called Sequezlize for reusable methods and setup which is also a skill used commonly with Db work. It has built in verification methods and so forth and is scalable and create extended custom methods as well.
- I thought I should use it more but for images in particular its WAY LESS code to use Firebase Cloud Functions/ and other Firebase Setup -> ie Storage bucket and Realtime DB.
- I worked specifically with MS SQL at Valence (see resume) and gained some VERY key skills using CASE and TOP 1 etc to really search quickly with LARGE amount of data instead of getting tons of data back and using JS or what not to manipulate it. This data was for KPIs aon dashboards. I also worked with a situation where each user had so much data they got their own DB on Azure.
