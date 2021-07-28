const Link = require('../models/link');
const slugify = require('slugify');

exports.create = (req, res) => {
  const {
    title,
    url,
    categories,
    type,
    medium
  } = req.body;
  //console.table({title, url, categories, type, medium});

  const slug = url;
  let link = new Link({
    title,
    url,
    categories,
    type,
    medium,
    slug
  });
  // get the user that posted the link
  link.postedBy = req.user._id;
  // saving link
  link.save((err, data) => {
    if (err) {
      res.status(400).json({
        error: 'Cannot create link, link already exists',
      })
    }
    res.json(data);
  })
};

exports.list = (req, res) => {
  //show all categories
  Link.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Links could not load'
      });
    }
    res.json(data);
  });
};

exports.read = (req, res) => {

};

exports.update = (req, res) => {

};

exports.remove = (req, res) => {

};

exports.clickCounter = (req, res) => {
  const {
    linkId
  } = req.body;
  Link.findByIdAndUpdate(linkId, {
    $inc: {
      clicks: 1
    }
  }, {
    upsert: true,
    new: true
  }).exec((err, result)=>{
    if (err) {
      return res.status(400).json({
        error: 'Could not update view count clicks'
      });
    }
    res.json(result);
  });
};