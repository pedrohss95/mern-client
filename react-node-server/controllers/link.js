const Link = require('../models/link');
const User = require('../models/user');
const Category = require('../models/category');
const AWS = require('aws-sdk');
const {
  linkPublishedParams
} = require('../helpers/email');
const slugify = require('slugify');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAcessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION

})

const ses = new AWS.SES({
  apiVersion: '2010-12-01'
});

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
    // find all users in the category
    User.find({
      categories: {
        $in: categories
      }
    }).exec((err, users) => {
      if (err) {
        console.log("Error throwing all users to send email on link pusblish")
        throw new Error(err)
      }
      Category.find({
        _id: {
          $in: categories
        }
      }).exec((err, result) => {
        data.categories = result;
        for (let i = 0; i < users.length; i++) {
          const params = linkPublishedParams(users[i].email, data);

          const sendEmail = ses.sendEmail(params).promise();

          sendEmail.then(success => {
              console.log("emails successfully sent", success);
              return;
            })
            .catch(failure => {
              console.log("emails failure sent", failure);
              return;
            })
        }

      })
    })

  })
};

exports.list = (req, res) => {

  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  //show all categories
  Link.find({})
    .populate('postedBy', 'name')
    .populate('categories', 'name slug')
    .sort({
      createAt: -1
    })
    .limit(limit)
    .skip(skip)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Links could not load'
        });
      }
      res.json(data);
    });
};

exports.read = (req, res) => {
  const {
    id
  } = req.params;
  Link.findOne({
    _id: id
  }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Cannot show the link'
      });
    }
    res.json(data);
  })
};

exports.update = (req, res) => {
  const {
    id
  } = req.params;
  const {
    title,
    url,
    categories,
    type,
    medium
  } = req.body;

  updatedLink = {
    title,
    url,
    categories,
    type,
    medium
  };

  Link.findOneAndUpdate({
    _id: id
  }, updatedLink, {
    new: true
  }).exec((err, updated) => {
    if (err) {
      return res.status(400).json({
        error: 'Error updating the link'
      });
    }
    res.json(updated);
  })
};

exports.remove = (req, res) => {
  const {
    id
  } = req.params;
  Link.findOneAndRemove({
    _id: id
  }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Cannot remove the link'
      });
    }
    res.json({
      message: 'Successfuly removed the link'
    });
  })
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
  }).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: 'Could not update view count clicks'
      });
    }
    res.json(result);
  });
};

exports.popular = (req, res) => {
  Link.find()
    .populate('postedBy', 'name')
    .sort({
      clicks: -1
    })
    .limit(3)
  .exec((err, links) => {
    if (err) {
      res.status(400).json({
        error: 'Links not found'
      })
    }
    res.json(links);
  })
}

exports.popularInCategory = (req, res) => {
  const {
    slug
  } = req.params;
  
  Category.findOne({
    slug
  }).exec((err, category) => {
    if (err) {
      res.status(400).json({
        error: 'Could not find category'
      })
    }
    Link.find({
        categories: category
      })
      .sort({
        clicks: -1
      })
      .limit(3)
    .exec((err, links) => {
      if (err) {
        res.status(400).json({
          error: 'Links not found'
        })
      }
      res.json(links);
    })
  })
}