const inquirer = require("inquirer");
const fs = require("fs");
const axios = require('axios');
const createHTML = require ('create-html');
const createPDF = require('html-pdf');

const redCSS = "<style>.btnColor{color: black; background-color: salmon; border: none;} .bodyColor{background-color: red;} .bioImg{border: 2px solid red;} .mainColor{color: firebrick;}</style>"
const purpleCSS = "<style>.btnColor{color: black; background-color: lavender; border: none;} .bodyColor{background-color: purple; color: white;} .bioImg{border: 2px solid purple;} .mainColor{color: indigo;}</style>"
const blueCSS = "<style>.btnColor{color: black; background-color: lightskyblue; border: none;} .bodyColor{background-color: blue; color: lightgray;} .bioImg{border: 2px solid blue;} .mainColor{color: darkblue;}</style>"
const greenCSS = "<style>.btnColor{color: black; background-color: lightgreen; border: none;} .bodyColor{background-color: green; color: palegreen;} .bioImg{border: 2px solid green;} .mainColor{color: green;}</style>"

let currentCSS;

let color;
let name;
let starred;

inquirer
    .prompt([
    {
        type: "input",
        message: "What is your GitHub username?",
        name: "name"
    },
    {
        type: "input",
        message: "What is your favorite color (red, green, blue, or purple)?",
        name: "color"
    }
    ]).then(function(response) {
    color = response.color.toLowerCase();
    if(color === 'red'){
        currentCSS = redCSS;
    }else if(color === "blue"){
        currentCSS = blueCSS;
    }else if(color === 'purple'){
        currentCSS = purpleCSS;
    }else if(color === 'green'){
        currentCSS = greenCSS;
    }
    name = response.name;
      axios.get('https://api.github.com/users/' + response.name + '?API_KEY=1f86a572b3e7bb32c847079099968c367910692a')
      .then(response => {
        //get data from api
        //key: 1f86a572b3e7bb32c847079099968c367910692a
        console.log(response)
        let fullName = response.data.name;
        console.log("Full Name: " + fullName);
        let location = response.data.location;
        console.log("Location: " + location);
        let pictureURL = response.data.avatar_url;
        console.log("Avatar URL: " + pictureURL);
        let profileURL = response.data.url;
        console.log("Profile URL: " + profileURL);
        let blogURL = response.data.blog;
        console.log("Blog URL: " + blogURL);
        let bio = response.data.bio;
        console.log("Bio: " + bio);
        let repo = response.data.public_repos;
        console.log("Repositories: " + repo);
        let followers = response.data.followers;
        console.log("Followers: " + followers);
        let following = response.data.following;
        console.log("Following: " + following);
        const cssLink = color + ".css";
        console.log("css link: " + cssLink);
    
        var html = createHTML({        
            title: 'GitHub Info',
            lang: 'en',
            head: `<meta charset="UTF-8"> <title>GitHub Profile</title> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"> <link rel="stylesheet" href="red.css"> ${currentCSS}`,
            body: `<div class = "container">
            <div class = "row">
                <div class="card mb-3 mx-auto">
                    <div class="row no-gutters">
                        <div class="col-xs-4" style="width: 18rem;">
                            <img src="${pictureURL}" class="card-img-top bioImg" alt="avatar">
                        </div>
                        <div class="col-xs-8">
                            <div class="card-body mainColor">
                                <h4 class="card-title">My name is ${fullName}</h4>
                                <p class="card-text">${bio}</p>
                                <p class = "card-text">${location}</p>
                                <a href="${profileURL}" class="btn btn-primary btnColor">GitHub</a>
                                <a href="${blogURL}" class="btn btn-primary btnColor">Blog</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class ="row justify-content-center">
                <div class = "col-xs-4" style="width: 18rem; margin: 10px;">
                    <div class="card">
                        <div class="card-body bodyColor">
                            <h5 class="card-title">Public Repositories</h5>
                            <p class="card-text">${repo}</p>
                        </div>
                    </div>
                </div>
                <div class = "col-xs-4" style="width: 18rem; margin: 10px;">
                    <div class="card">
                        <div class="card-body bodyColor">
                            <h5 class="card-title">Followers</h5>
                            <p class="card-text">${followers}</p>
                        </div>
                    </div>
                </div>
                <div class = "col-xs-4" style="width: 18rem; margin: 10px;">
                    <div class="card" >
                        <div class="card-body bodyColor">
                            <h5 class="card-title">Following</h5>
                            <p class="card-text">${following}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
        })
        fs.writeFile('index.html', html, function (err) {
            if (err) console.log(err)
            const htmlPage = fs.readFileSync('./index.html', 'utf8');
            const options = { format: 'Letter' };
            createPDF.create(htmlPage, options).toFile('./github.pdf', function(err, res) {
                if (err) return console.log(err);
                console.log(res); // { filename: '/app/github.pdf' }
            })
        });
    })
    .catch(error => {
        console.log(error);
    });

  });
