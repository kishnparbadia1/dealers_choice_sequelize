const Sequelize = require('sequelize');
const { STRING, INTEGER } = Sequelize.DataTypes 

const db = new Sequelize("postgres://localhost/dealers_choice_sequelize")


const Company = db.define('company', {
  name: {
    type: STRING,
  },
})

const Candy = db.define('candy', {
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },

  },
  flavor: {
    type: STRING,

  },
  yearMade: {
    type: INTEGER,
  }
})


Candy.belongsTo(Company);
Candy.belongsTo(Candy, {as: 'sisterBrand'})


const syncAndSeed = async() => {
  await db.sync({ force: true})
  const [snickers, twix, payday, smarties, Mars, Hershey, Nestle] = await Promise.all([
    Candy.create({name: 'snickers', flavor: 'chocolate', yearMade: 1930 }),
    Candy.create({name: 'twix', flavor: 'chocolate', yearMade: 1967 }),
    Candy.create({name: 'payday', flavor: 'peanut', yearMade: 1932 }),
    Candy.create({name: 'smarties', flavor: 'sugar', yearMade: 1949 }),
    Company.create({name: 'Mars'}),
    Company.create({name: 'Hershey'}),
    Company.create({name: 'Nestle'}),
  ])

  snickers.companyId = Mars.id;
  twix.companyId = Mars.id;
  payday.companyId = Hershey.id;
  smarties.companyId = Nestle.id;
  snickers.sisterBrandId = twix.id
  twix.sisterBrandId = snickers.id

  await Promise.all ([
    snickers.save(),
    twix.save(),
    payday.save(),
    smarties.save(),
  ])
    
}

module.exports = {
  syncAndSeed,
  Company,
  Candy,
}