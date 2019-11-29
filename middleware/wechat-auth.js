export default function ({store, route, redirect}) {
  if (!store.state.wechat.authUser) {
    let { fullPath } = route

    fullPath = encodeURIComponent(fullPath.substr(1))

    return redirect(`/wechat-redirect?visit=${fullPath}`)
  }
}
