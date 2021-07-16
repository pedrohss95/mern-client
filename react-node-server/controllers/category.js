const Category = require('../models/category');
const Link = require('../models/link');
const slugify = require('slugify');
const formidable = require('formidable');
const {
  v4: uuidv4
} = require('uuid');
const AWS = require('aws-sdk');
const fs = require('fs');

//s3

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAcessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// previous functions for create category
// exports.create = (req, res) => {
//   let form = new formidable.IncomingForm();

//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       return res.status(400).json({
//         error: "Image could not upload"
//       });
//     };
//     // console.table({err, fields, files});
//     const {
//       name,
//       content
//     } = fields;
//     const {
//       image
//     } = files;
//     const slug = slugify(name);
//     let category = new Category({
//       name,
//       content,
//       slug
//     })
//     if (image.size > 2000000) {
//       return res.status(400).json({
//         error: 'Image should be less than 2 mb'
//       })
//     }
//     //upload image to S3

//     const params = {
//       Bucket: 'pedrohssbucket',
//       Key: `category/${uuidv4()}`,
//       Body: fs.readFileSync(image.path),
//       ACL: 'public-read',
//       ContentType: 'image/jpg'
//     }
//     s3.upload(params, (err, data) => {
//       if (err){
//         console.log('AWS S3 upload failed', err);
//         return res.status(400).json({error: "Upload to s3 failed"});
//       } 
//       console.log('AWS S3 UPLOADED DATA', data);
//       category.image.url = data.Location
//       category.image.key = data.Key

//       //save to db
//       category.save((err, success)=> {
//         if (err){
//           console.log('fail to save to db', err);
//           return res.status(400).json({error: "Category save to db failed"});
//         } 
//         return res.json(success);
//       })
//     });

//   })
// }

// exports.create = (req, res) => {
//     const { name, content } = req.body;
//     const slug = slugify(name);
//     const image = {
//         url: `https://via.placeholder.com/200x150.png?text=${process.env.CLIENT_URL}`,
//         key: '123'
//     };

//     const category = new Category({name, slug, image});
//     category.postedBy = req.user._id;

//     category.save((err, data)=>{
//         if (err){
//             console.log('Category create error', err);
//             return res.status(400).json({
//                 error: "Category creation failed"
//             })
//         }
//         res.json(data);
//     })
// },

exports.create = (req, res) => {
  const {
    name,
    image,
    content
  } = req.body;
  // image data
  const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const type = image.split(';')[0].split('/')[1];

  const slug = slugify(name);
  let category = new Category({
    name,
    content,
    slug
  })

  //upload image to S3
  const params = {
    Bucket: 'pedrohssbucket',
    Key: `category/${uuidv4()}.${type}`,
    Body: base64Data,
    ACL: 'public-read',
    ContentEnconding: 'base64',
    ContentType: `image/${type}`
  }
  s3.upload(params, (err, data) => {
    if (err) {
      console.log('AWS S3 upload failed', err);
      return res.status(400).json({
        error: "Upload to s3 failed"
      });
    }
    console.log('AWS S3 UPLOADED DATA', data);
    category.image.url = data.Location
    category.image.key = data.Key

    //posted by
    category.postedBy = req.user._id;

    //save to db
    category.save((err, success) => {
      if (err) {
        console.log('fail to save to db', err);
        return res.status(400).json({
          error: "Category save to db failed"
        });
      }
      return res.json(success);
    })
  });

}

exports.list = (req, res) => {
    //show all categories
    Category.find({}).exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Categories could not load'
        });
      }
      res.json(data);
    });
  },
  exports.read = (req, res) => {
    const {
      slug
    } = req.params;
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    Category.findOne({
        slug
      })
      .populate('postedBy', "_id name username")
      .exec((err, category) => {
        if (err) {
          return res.status(400).json({
            error: 'Could not load category'
          });
        }
        //res.json(category);
        Link.find({
            categories: category
          })
          .populate('postedBy', "_id name username")
          .populate('categories', "name")
          .sort({createAt: -1})
          .limit(limit)
          .skip(skip)
          .exec((err, links) => {
            if (err) {
              return res.status(400).json({
                error: 'Could not load links for this category'
              })
            }
            res.json({category, links})
          });
      });
  },
  exports.update = (req, res) => {

  },
  exports.remove = (req, res) => {

  }