import rp from 'request-promise'
import conf from '../config'
import crypto from 'crypto'

export const openidAndSessionKey = async code => {
  let opts = {
    uri: 'https://api.weixin.qq.com/sns/jscode2session',
    qs: {
      appid: conf.mina.appid,
      secret: conf.mina.secret,
      grant_type: 'authorization_code'
    },
    json: true
  }
  opts.qs.js_code = code

  let res = await rp(opts)
  return res
}

export class WXBizDataCrypt {
  constructor (sessionKey) {
    this.appId = conf.mina.appid
    this.sessionKey = sessionKey
  }

  decryptData (encryptedData, iv) {
      // base64 decode
    let decoded
    let sessionKey = Buffer.from(this.sessionKey, 'base64')
    encryptedData = Buffer.from(encryptedData, 'base64')
    iv = Buffer.from(iv, 'base64')

    try {
         // 解密
      let decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
        // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true)
      decoded = decipher.update(encryptedData, 'binary', 'utf8')
      decoded += decipher.final('utf8')

      decoded = JSON.parse(decoded)
    } catch (err) {
      throw new Error('Illegal Buffer')
    }

    if (decoded.watermark.appid !== this.appId) {
      throw new Error('Illegal Buffer')
    }

    return decoded
  }
}
