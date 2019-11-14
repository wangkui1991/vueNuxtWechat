import rp from 'request-promise'
import _ from 'lodash'
import { writeFileSync } from 'fs'

var _characters = []

export const getApiCharacters = async (page = 1) => {
  const url = `https://www.anapioficeandfire.com/api/characters?page=${page}&pageSize=50`

  let body = await rp(url)
  body = JSON.parse(body)
  _characters = _.union(_characters, body)

  if (body.length < 50) {
    console.log('爬完了')
    // fs.writeFileSync('./allCharacters.json', JSON.stringify(_allCharacters), 'utf8')
  } else {
    writeFileSync('./characters.json', JSON.stringify(_characters), 'utf8')
    await sleep(1000)
    console.log(page)
    page++
    getApiCharacters(page)
  }
}

getApiCharacters()

const sleep = time => new Promise(resolve => setTimeout(resolve, time))
