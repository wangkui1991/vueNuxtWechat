import fs from 'fs'
import mongoose from 'mongoose'
import config from '../config'
import { resolve } from 'path'
import R from 'ramda'
const models = resolve(__dirname, '../database/schema')

const jsonPath = path => resolve(__dirname, '../database/json/', path)
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(resolve(models, file)))

const formatData = R.map(i => {
  i._id = i.nmId
  return i
})
let wikiCharacters = require(resolve(
  __dirname,
  jsonPath('completeCharacters.json')
))

wikiCharacters = formatData(wikiCharacters)
let wikiHouses = require(resolve(__dirname, jsonPath('completeHouses.json')))

export const database = app => {
  mongoose.set('debug', true)

  mongoose.connect(config.db)

  mongoose.connection.on('disconnected', () => {
    mongoose.connect(config.db)
  })

  mongoose.connection.on('error', err => {
    console.error(err)
  })

  mongoose.connection.on('open', async () => {
    console.log('Connected to MongoDB', config.db)
    const WikiHouse = mongoose.model('WikiHouse')
    const WikiCharacter = mongoose.model('WikiCharacter')

    const existWikiHouses = await WikiHouse.find({}).exec()
    const existWikiCharacters = await WikiCharacter.find({}).exec()
    if (!existWikiHouses.length) WikiHouse.insertMany(wikiHouses)
    if (!existWikiCharacters.length) WikiCharacter.insertMany(wikiCharacters)
  })
}
