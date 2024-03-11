# LevelingUp

## Overview

Do you want to make a change in your life for the better? You can! Through LevelingUp, you get to fully customize your workout routine and set fitness goals! LevelingUp helps you keep track of your fitness journey. You can register for an account and log your routine. For each routine, you can add exercises and check them off as you go. You can also set goals for each workout so you know your progress!

## Data Model

LevelingUp will have data regarding the user and their respective workout routine and goals.

* A user can have multiple workout routines
* Each workout routine will have a list of different exercises and goals

Example User:

```javascript
{
  username: "gymrat",
  hash: // hashed password,
  routines: // array of references to workout routines
}
```

Example Workout Routine:

```javascript
{
  user: // reference to a User object
  name: "Leg Day",
  exercises: [
    {exercise: "squats", sets: 4, reps: 10},
    {exercise: "RDLs", sets: 4, reps: 10},
    {exercise: "hip abductors", sets: 4, reps: 12},
    {exercise: "leg extensions", sets: 3, reps: 12},
  ],
  goal: // user sets goal
}
```

## [Link to Commented First Draft Schema](db.mjs) 


## Wireframes

(__TODO__: wireframes for all of the pages on your site; they can be as simple as photos of drawings or you can use a tool like Balsamiq, Omnigraffle, etc.)

/list/create - page for creating a new shopping list

![list create](documentation/list-create.png)

/list - page for showing all shopping lists

![list](documentation/list.png)

/list/slug - page for showing specific shopping list

![list](documentation/list-slug.png)

## Site map

(__TODO__: draw out a site map that shows how pages are related to each other)

Here's a [complex example from wikipedia](https://upload.wikimedia.org/wikipedia/commons/2/20/Sitemap_google.jpg), but you can create one without the screenshots, drop shadows, etc. ... just names of pages and where they flow to.

## User Stories or Use Cases

1. as new user, I can register for a new account when I got on the website
2. as a user, I can log in to the website
3. as a user, I can create one or more workout routines
4. as a user, I can set specific goals within each workout routine and see them all together on the goals page
5. as a user, I can cross off exercises after I have done them
6. as a user, I can add exercises and goals to a workout routine

## Research Topics

(__TODO__: the research topics that you're planning on working on along with their point values... and the total points of research topics listed)

* (6 points) User authentication
    * User authentication is the process in which authorized users can access the website that are somewhat customized/private to them
    * Passport is a middleware that authenticates requests
    * MongoDB will be used to store user information
    * This library has many nuances to learn, so I will be giving this task 6 points
  
* (4 points) Show day of the week after user login
    * Accessing time is important for my website because it provides more accessibility
    * Users can see the day of the week on the home page so they can better navigate their workout routine
    * I will be using Moment.js to accomplish this
    * Moment.js can easily fetch and manipulate time on the web

10 points in total

## [Link to Initial Main Project File](app.mjs) 

(__TODO__: create a skeleton Express application with a package.json, app.mjs, views folder, etc. ... and link to your initial app.mjs)

## Annotations / References Used

(__TODO__: list any tutorials/references/etc. that you've based your code off of)

1. [passport.js docs](http://passportjs.org/docs)
2. [implement passport with node.js tutorial](https://medium.com/@prashantramnyc/node-js-with-passport-authentication-simplified-76ca65ee91e5)
3. [moment.js docs](https://momentjs.com/)