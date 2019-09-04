const tip =
  '走通接口模版，不同数据的处理\n' +
  '给我字符串我返回你字符串\n' +
  '给我地址我给你地址的坐标\n' +
  '给我图片我也给你图片\n' +
  '给我音频我也给你音频\n' +
  '给我视频我也给你视频\n' +
  '给我数字1我会重设菜单拦喔，重新关注可见\n' +
  '事件我也监听了\n'

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
    ctx.body =
      message.Location_X + ':' + message.Location_Y + ':' + message.Label
  } else if (message.MsgType === 'link') {
    ctx.body = [
      {
        title: message.Title,
        description: message.Description,
        picUrl: '',
        url: message.Url
      }
    ]
  }
}
