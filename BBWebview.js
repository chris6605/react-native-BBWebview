import React, { Component } from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    WebView,
    Platform
} from 'react-native';

import BaseComponent from './BaseComponent';

/**
 *  使用方式
 * 
 * <BBWebview 
 *  style={{ flex: 1 }}
    source={this.state.url}
    dismissLoading={this._dismissLoading.bind(this)}
    requestOverTime={this.webviewRequstOverTimeAction.bind(this)}
    /> 
 */

export default class BBWebView extends BaseComponent {

    loadEnd = false  // 是否加载完成 无论成功失败
    requestOverTime = false  // 是否超时

    headers = {
        'device-id': global.deviceInfo.device_id,
        'version': global.deviceInfo.version,
        'version-id': global.deviceInfo.version_id,
        'os': Platform.OS,
        'uid': global.user ? global.user.uid : '',
        'token': global.user ? global.user.token : ''
    }

    static defaultProps = {
        time: 10000,
        source: 'http://www.baidu.com'
    }


    constructor(props) {
        super(props);
        this.state = {
            source: this.props.source,
            time: this.props.time
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.source !== nextProps.source) {
            this.setState({
                source: nextProps.source
            });
        }
    }

    componentDidMount() {
        this._startTimimg()
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
    }

    iBerWebviewReload() {
        this.loadEnd = false
        this.requestOverTime = false
        this._startTimimg()
        this.state.source && this.webView && this.webView.injectJavaScript('window.location.reload()');
    }


    _startTimimg() {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if (!this.loadEnd) {
                this.requestOverTime = true
                this.props.requestOverTime && this.props.requestOverTime();
            }
        }, this.state.time);
    }


    render() {
        return <View style={{ ...this.props.style }}>
            <WebView ref={ref => this.webView = ref}
                style={{ flex: 1 }}
                automaticallyAdjustContentInsets={false}
                mediaPlaybackRequiresUserAction={true}
                source={{ uri: this.state.source, headers: this.headers }}
                javaScriptEnabled={true}
                dataDetectorTypes='none'
                startInLoadingState={false}
                scrollEnabled={true}
                domStorageEnabled={true}
                onMessage={this.props.onMessage}
                onNavigationStateChange={this.props.navigationStateChange}
                onLoadEnd={() => {
                    this.loadEnd = true;
                    // 如果已經超時 這裡就不做任何處理了
                    if (!this.requestOverTime) {
                        this.props.dismissLoading();
                    } else {
                        this.timer && clearTimeout(this.timer)
                    }
                    this.props.onLoadEnd && this.props.onLoadEnd();
                }}
            />

        </View>
    }

}
