const tip = '历史变迁中的激流勇进\n' +
  '战斗吧  英雄 <a href="http://coding.imooc.com">一起搞事情</a>'

let mp = require('../wechat')
let client = mp.getWechat()
let menu = require('./menu').default
export default async (ctx, next) => {
  const message = ctx.weixin
  console.log(message)
  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      ctx.body = tip
    } else if (message.Event === 'unsubscribe') {
      console.log('取关了')
    } else if (message.Event === 'LOCATION') {
      ctx.body = message.Latitude + ':' + message.Longitude
    } else if (message.Event === 'view') {
      ctx.body = message.EventKey + message.MenuId
    } else if (message.Event === 'pic_sysphoto') {
      ctx.body = message.Count + 'photo sent'
    }
  } else if (message.MsgType === 'text') {
    let data = message.Content
    if (message.Content === '1') {
      data = await client.handle('createMenu', menu)
      console.log(data)
    }
    ctx.body = data
  } else if (message.MsgType === 'image') {
    ctx.body = {
      type: 'image',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'voice') {
    ctx.body = {
      type: 'voice',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'video') {
    ctx.body = {
      type: 'video',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'location') {
    ctx.body = message.Location_X + ':' + message.Location_Y + ':' + message.Label
  } else if (message.MsgType === 'link') {
    ctx.body = [{
      title: message.Title,
      description: message.Description,
      picUrl: '',
      url: message.Url
    }]
  }
}
