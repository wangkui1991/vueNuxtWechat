import cheerio from 'cheerio'
import rp from 'request-promise'
import R from 'ramda'

import { writeFileSync } from 'fs'

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

    const characterDom = $(this).find('td.character a')
    const name = characterDom.text()
    const chId = characterDom.attr('href')

    const playedByDom = $(this).find('td.primary_photo a img')
    const playedBy = playedByDom.attr('title')

    photos.push({nmId, chId, name, playedBy})
  })

  console.log('共拿到' + photos[0].playedBy + '--' + photos[0].name + '--' + photos[0].nmId + '--' + photos[0].chId + '条数据')
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
getIMDBCharacters()
