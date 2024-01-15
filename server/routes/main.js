// Main website Route

const express = require('express');
const router = express.Router();
const Post = require('../models/postmodel');
const User = require('../models/usermodel');

//Routes

// GET
// Home

router.get('/', async (req, res) => {
  try {
    const locals = {
      title: 'Nodejs Blog',
      description: 'Using Nodejs Express & Mongodb',
    };

    const perPage = 10;
    const page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/',
    });
  } catch (error) {
    console.log(error);
  }
});

// router.get('/', async (req, res) => {
//   const locals = {
//     title: 'Nodejs Blog',
//     description: 'Using Nodejs Express & Mongodb',
//   };

//   try {
//     const data = await Post.find();
//     res.render('index', { locals, data });
//   } catch (error) {
//     console.log(error);
//   }
// });

// GET
// Post by Id

router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: 'Using Nodejs Express & Mongodb',
      currentRoute: `/post/${slug}`,
    };

    res.render('post', { locals, data });
  } catch (error) {
    console.log(error);
  }
});

//Post
//Seach

router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: 'Nodejs Blog',
      description: 'Using Nodejs Express & Mongodb',
    };
    let searchTerm = req.body.searchTerm;
    //remove special character searching in search bar
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-z0-9]/g, '');

    // console.log(searchTerm);
    const data = await Post.find({
      $or: [
        {
          title: { $regex: new RegExp(searchNoSpecialChar, 'i') },
        },
        {
          body: { $regex: new RegExp(searchNoSpecialChar, 'i') },
        },
      ],
    });
    res.render('search', {
      data,
      locals,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about',
  });
});
module.exports = router;
