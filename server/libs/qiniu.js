import qiniu from 'qiniu'
import config from '../config'
import { exec } from 'shelljs'

qiniu.conf.ACCESS_KEY = config.qiniu.AK
qiniu.conf.SECRET_KEY = config.qiniu.SK
const bucket = config.qiniu.bucket
// var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

// var config = new qiniu.conf.Config()

// config.zone = qiniu.zone.Zone_z2

// var bucketManager = new qiniu.rs.BucketManager(mac, config)

//  q15ipgb8x.bkt.clouddn.com

// 因为七牛抓取互联网资源这个 node SDK 有坑，所以直接用 qshell，所以使用前需要全局安装
// npm i qshell -g
// 然后配置账号
// qshell account <你的AK> <你的SK>
export const fetchImage = async (url, key) => {
  //   const client = new qiniu.rs.Client()
  return new Promise((resolve, reject) => {
    // client.fetch(url, bucket, key, (err, ret) => {
    //   if (err) reject(err)
    //   else resolve(ret)
    // })
    let bash = `qshell fetch ${url} ${bucket} -k '${key}'`

    exec(bash, (code, stdout, stderr) => {
      if (stderr) return reject(stderr)
      if (stdout === 'Fetch error, 504 , xreqid:') return reject(stdout)

      resolve(stdout)
    })
  })
}
