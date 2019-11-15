import rp from 'request-promise'
import R from 'ramda'
import _ from 'lodash'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

const normalizedContent = content =>
  _.reduce(
    content,
    (acc, item) => {
      if (item.text) acc.push(item.text)
      if (item.elements && item.elements.length) {
        let _acc = normalizedContent(item.elements)
        acc = R.concat(acc, _acc)
      }
      return acc
    },
    []
  )
const normalizedSections = R.compose(
  R.nth(1),
  R.splitAt(1),
  R.map(i => ({
    level: i.level,
    title: i.title,
    content: normalizedContent(i.content)
  }))
)

// 拿到每份数据的wikiId
const getWikiId = async data => {
  const query = data.name || data.cname
  const url = `https://asoiaf.fandom.com/zh/api/v1/Search/List?query=${encodeURI(
    query
  )}`
  let res
  try {
    res = await rp(url)
  } catch (err) {
    console.log(err)
  }
  res = JSON.parse(res)
  res = res.items[0]
  console.log(res.id)
  return R.merge(data, res)
}
// wiki上返回的数据格式化
const getWikiDetail = async data => {
  const { id } = data
  const url = `https://asoiaf.fandom.com/zh/api/v1/Articles/AsSimpleJson?id=${id}`
  let res
  try {
    res = await rp(url)
  } catch (err) {
    console.log(err)
  }
  res = JSON.parse(res)

  console.log(id, 'done')

  const getCNameAndIntro = R.compose(
    i => ({
      cname: i.title,
      intro: R.map(R.prop(['text']))(i.content)
    }),
    R.pick(['title', 'content']),
    R.nth(0),
    R.filter(R.propEq('level', 1)),
    R.prop('sections')
  )
  const getLevel = R.compose(
    R.project(['title', 'content', 'level']),
    R.reject(R.propEq('title', '扩展阅读')),
    R.reject(R.propEq('title', '引用与注释')),
    R.filter(i => i.content.length),
    R.prop('sections')
  )

  //   const cnameIntro = getCNameAndIntro(res)
  let sections = getLevel(res)
  let body = R.merge(data, getCNameAndIntro(res))
  sections = normalizedSections(sections)
  body.sections = sections
  body.wikiId = id
  return R.pick(
    [
      'name',
      'cname',
      'playedBy',
      'profile',
      'images',
      'nmId',
      'chId',
      'sections',
      'intro',
      'wikiId',
      'words'
    ],
    body
  )
}

// 根据IMDb.json这份数据，爬wiki上的人物数据，并且整合
export const getWikiCharacters = async () => {
  let data = require(resolve(__dirname, '../../fullCharacters.json'))
  data = [data[0], data[1]]
  data = R.map(getWikiId, data)
  data = await Promise.all(data)
  console.log('获取wiki id')
  console.log(data[0])
  data = R.map(getWikiDetail, data)
  data = await Promise.all(data)
  console.log('获取wiki详细资料')
  console.log(data[0])
  writeFileSync('./finalCharacters.json', JSON.stringify(data, null, 2), 'utf8')
}

getWikiCharacters()
