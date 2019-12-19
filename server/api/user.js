import mongoose from 'mongoose'
const User = mongoose.model('User')

export async function login (email, password) {
  let match = false

  const user = await User.findOne({email: email}).exec()

  if (user) match = await user.comparePassword(password, user.password)

  return {match, user}
}

export async function findUserByUnionId (unionid) {
  const user = await User.findOne({unionid: unionid}).exec()

  return user
}

export async function saveFromSession (session) {
  let user = new User({
    openid: [session.user.openid],
    unionid: session.user.unionid,
    nickname: session.user.nickname,
    address: session.user.address,
    province: session.user.province,
    country: session.user.country,
    city: session.user.city,
    sex: session.user.sex,
    headimgurl: session.user.headimgurl,
    avatarUrl: session.user.avatarUrl
  })

  user = await user.save()

  return user
}

export async function dbUsers (ctx, next) {
  const res = await User.find({}).exec()

  return res
}
