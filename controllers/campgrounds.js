const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully added a new campground!')
    res.redirect(`campgrounds/${campground._id}`);
}

module.exports.showCampground = (req, res) => {
    const campground = res.locals.foundCamp;
    res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = (req, res) => {
    const campground = res.locals.foundCamp;
    res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res) => {
    const campground = res.locals.foundCamp;
    await Campground.findByIdAndUpdate(campground._id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    };
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const campground = res.locals.foundCamp;
    campground.images.forEach(async function (image) {
        await cloudinary.uploader.destroy(image.filename);
    });
    console.log("Deleted associated images from Cloudinary");
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Campground has been deleted!');
    res.redirect('/campgrounds');
};