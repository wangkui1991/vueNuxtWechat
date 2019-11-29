import {getWechat, getOAuth} from '../wechat'
import mongoose from 'mongoose'
const client = getWechat()
const User = mongoose.model('User')
export async function getSignatureAsync (url) {
  const data = await client.fetchAccessToken()
  const token = data.access_token
  const ticketData = await client.fetchTicket(token)
  const ticket = ticketData.ticket

  let params = client.sign(ticket, url)
  params.appId = client.appID
  console.log('params', params)
  return params
}

export function getAuthorizeURL (...args) {
  console.log(12)
  const oauth = getOAuth()
  return oauth.getAuthorizeURL(...args)
}

export async function getUserByCode (code) {
  const oauth = getOAuth()
  const data = await oauth.fetchAccessToken(code)
  console.log('data', data)
  // const user = await oauth.getUserInfo(data.access_token, data.openid)

  const user = await oauth.getUserInfo(data.access_token, data.unionid)

  const existUser = await User.findOne({
    unionid: data.unionid
  }).exec()
  console.log('data', data, existUser)
  if (!existUser) {
    let newUser = new User({
      openid: [data.openid],
      unionid: data.unionid,
      nickname: user.nickname,
      address: user.address,
      province: user.province,
      country: user.country,
      city: user.city,
      gender: user.sex,
      headimgurl: user.headimgurl
    })
    await newUser.save()
  }

  return user
}
