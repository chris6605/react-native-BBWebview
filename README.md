# react-native-BBWebview
带超时机制的 webview
默认的超时时间为10秒
可以接受 onLoadEnd onMessage navigateStateChange 的回调
headers 可以忽略 如果你用不到
用的是自己的 loading 动画 不是转圈圈那个 所以你最好把你页面的dismissLoading 的方法给传进去 因为在加载完成的时候或者超时失败的时候可以取消 loading

