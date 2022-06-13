
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelpCamp')
    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch(err => {
        console.log("Oh no! Error connecting to MongoDB!");
        console.log(err);
    })

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30);
        const camp = new Campground({
            author: '628bb59e2e2ab5f0299cc3b7',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: "https://res.cloudinary.com/makaelas/image/upload/v1654025128/YelpCamp/huhgzxqcilf4tytclmel.jpg",
                    filename: "YelpCamp/huhgzxqcilf4tytclmel"
                },
                {
                    url: "https://res.cloudinary.com/makaelas/image/upload/v1654025130/YelpCamp/wml7aqnds8tag2keexe0.jpg",
                    filename: "YelpCamp/wml7aqnds8tag2keexe0"
                },
                {
                    url: "https://res.cloudinary.com/makaelas/image/upload/v1654025131/YelpCamp/jhdcv60qi1hxj2mulbk4.jpg",
                    filename: "YelpCamp/jhdcv60qi1hxj2mulbk4"
                },
                {
                    url: "https://res.cloudinary.com/makaelas/image/upload/v1654025131/YelpCamp/k080kbp69qit8d5mi6so.jpg",
                    filename: "YelpCamp/k080kbp69qit8d5mi6so"
                },
                {
                    url: "https://res.cloudinary.com/makaelas/image/upload/v1654025134/YelpCamp/mg36bdtnbfnfq5ae0zsy.jpg",
                    filename: "YelpCamp/mg36bdtnbfnfq5ae0zsy"
                },
                {
                    url: "https://res.cloudinary.com/makaelas/image/upload/v1654025135/YelpCamp/dt3mhhxqe99tomwy0awx.jpg",
                    filename: "YelpCamp/dt3mhhxqe99tomwy0awx"
                },
                {
                    url: "https://res.cloudinary.com/makaelas/image/upload/v1654025136/YelpCamp/bssnuohii3g6fkl1v4f6.jpg",
                    filename: "YelpCamp/bssnuohii3g6fkl1v4f6"
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, fuga quasi blanditiis fugiat laboriosam sed tempora, natus assumenda neque maiores id, amet magnam vero quae voluptas incidunt! Obcaecati, quidem aspernatur! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio, corporis. Ab aliquam quasi voluptatem animi sed, error rem. Dolorum rem eligendi ea ab odit eveniet! Aut molestias ullam sed! Harum.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            }
        });
        await camp.save();
    };
};

seedDB().then(() => {
    mongoose.connection.close().then(() => {
        console.log("Seeds are in, bye now!");
    });
});