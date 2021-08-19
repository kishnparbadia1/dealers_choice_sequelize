const express = require('express');

const { syncAndSeed, Candy, Company } = require('./db/db')

const app = express();

app.get('/candies', async(req, res, next) => {
  try{
    const candies = await Candy.findAll({
      include: [
        {
         model: Candy,
         as: 'sisterBrand'
        },
        Company
        
      ]
    });
    res.send(candies)
  }
  catch(err){
    next(err);
  }
})

app.get('/companies', async(req, res, next) => {
  try {
    const companies = await Company.findAll();
    res.send(companies)
  }
  catch(err){
    next(err)
  }
})


const init = async() => {
  try{
    await syncAndSeed();
    app.listen(3011)
  } catch (err) {
    console.log(err);
  }
}

init();