const mongoose = require('mongoose')

// 设置模型
const TokenSchema = new mongoose.Schema({
  name: String,
  access_token: String,
  expires_in: Number,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})
// 每次保存前更新时间
TokenSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})
// 设置模型静态方法
TokenSchema.statics = {
  // 拿到token
  async getAccessToken () {
    const token = await this.findOne({
      name: 'access_token'
    }).exec()

    return token
  },
  //   保存token，如果有就更新，如果没有就新增
  async saveAccessToken (data) {
    let token = await this.findOne({
      name: 'access_token'
    }).exec()

    if (token) {
      token.access_token = data.access_token
      token.expires_in = data.expires_in
    } else {
      token = new Token({
        name: 'access_token',
        expires_in: data.expires_in,
        access_token: data.access_token
      })
    }

    try {
      await token.save()
    } catch (e) {
      console.log('存储失败')
      console.log(e)
    }

    return data
  }
}

const Token = mongoose.model('Token', TokenSchema)
