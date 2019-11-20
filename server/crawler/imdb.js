import cheerio from 'cheerio'
import rp from 'request-promise'
import R from 'ramda'
import { resolve } from 'path'
import { writeFileSync } from 'fs'

const sleep = time => new Promise(resolve => setTimeout(resolve, time))
const jsonPath = path => resolve(__dirname, '../database/json/', path)
export const getIMDBCharacters = async () => {
  const options = {
    uri: 'http://www.imdb.com/title/tt0944947/fullcredits?ref_=tt_cl_sm#cast',

    transform: body => cheerio.load(body)
  }

  const $ = await rp(options)

  let photos = []
  $('table.cast_list tr.odd, tr.even').each(function () {
    const nmIdDom = $(this).find('td.primary_photo a')

    const nmId = nmIdDom.attr('href')

    const characterDom = $(this).find('td.character a:first-child')
    const name = characterDom.text()
    const chId = characterDom.attr('href')

    const playedByDom = $(this).find('td.primary_photo a img')
    const playedBy = playedByDom.attr('title')

    photos.push({ nmId, chId, name, playedBy })
  })

  console.log(
    '共拿到' +
      photos[0].playedBy +
      '--' +
      photos[0].name +
      '--' +
      photos[0].nmId +
      '--' +
      photos[0].chId +
      '条数据'
  )
  const fn = R.compose(
    R.map((photo, index) => {
      const reg1 = /\/name\/(.*?)\/\?ref/
      const reg2 = /\/title\/(.*?)\/characters/
      const match1 = photo.nmId.match(reg1)
      const match2 = photo.chId.match(reg2)

      photo.nmId = match1[1]
      if (match2) {
        photo.chId = match2[1]
      }

      return photo
    }),
    R.filter(photo => photo.playedBy && photo.name && photo.nmId && photo.chId)
  )
  photos = fn(photos)
  //   console.log(photos[1])

  console.log('清洗后，剩余' + photos.length + '条数据')

  writeFileSync('./imdb.json', JSON.stringify(photos, null, 2), 'utf8')
}

const fetchIMDbProfile = async url => {
  const options = {
    uri: url,
    transform: body => cheerio.load(body)
  }
  const $ = await rp(options)
  let img = $('img#name-poster')
  // console.log('img', img)
  let src = img.attr('src')
  console.log('src,src', src)
  if (src) {
    src = src.split('_V1').shift()
    src += '_V1.jpg'
  }
  return src
}
export const getIMDbProfile = async () => {
  const characters = require(resolve(__dirname, jsonPath('wikiCharacters.json')))
  for (let i = 0; i < characters.length; i++) {
    if (!characters[i].profile) {
      const url = `https://www.imdb.com/name/${characters[i].nmId}/`
      console.log('正在爬取' + characters[i].name)
      const src = await fetchIMDbProfile(url)
      console.log('已经爬到' + src)
      characters[i].profile = src
      writeFileSync(
        jsonPath('imdbCharacters.json'),
        JSON.stringify(characters, null, 2),
        'utf8'
      )
      await sleep(500)
    }
  }
}

const fetchIMDbImage = async url => {
  const options = {
    uri: url,
    transform: body => cheerio.load(body)
  }
  const $ = await rp(options)
  let images = []
  $('a.titlecharacters-image-grid__thumbnail-link').each(function () {
    let src = $(this)
      .find('img')
      .attr('src')
    if (src) {
      src = src.split('_V1').shift()
      src += '_V1.jpg'
      images.push(src)
    }
  })

  return images.slice(0, 3)
}

export const getIMDbImages = async () => {
  const characters = require(resolve(__dirname, jsonPath('validCharacters.json')))
  for (let i = 0; i < characters.length; i++) {
    if (!characters[i].images) {
      const url = `https://www.imdb.com/title/${characters[i].chId}/characters/${characters[i].nmId}`
      console.log('正在爬取' + characters[i].name)
      const images = await fetchIMDbImage(url)
      console.log('已经爬到' + images)
      characters[i].images = images
      writeFileSync(
        jsonPath('fullCharacters.json'),
        JSON.stringify(characters, null, 2),
        'utf8'
      )
      await sleep(500)
    }
  }
}

// const checkIMDbProfile = () => {
//   const characters = require(resolve(__dirname, '../../imdbCharacters.json'))
//   const newCharacters = []
//   characters.forEach(item => {
//     if (item.profile) {
//       newCharacters.push(item)
//     }
//   })
//   writeFileSync(
//     './validCharacters.json',
//     JSON.stringify(characters, null, 2),
//     'utf8'
//   )
// }

getIMDbImages()
