import axios from 'axios'
import Swal from 'sweetalert2'

const instance = axios.create({
    baseURL: '/game'
});
instance.defaults.timeout = 5000
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    const {data: {errMsg, success}} = response
    if (!success) {
        Swal.fire({
            type: 'error',
            title: '操作失败',
            text: errMsg
        })
    }
    // 对响应数据做点什么
    return response.data || {}
}, function (error) {
    if (!error.response) {
        error.response = {}
    }
    // 对响应错误做点什么
    // return Promise.reject(error)
    return Promise.resolve(Object.assign({data: {}, errMsg: '未知错误', success: false}, error.response))
});

const http = new function () {
    this.login = (data) => instance.post('/login', data);
    this.joinGame = (data) => instance.post('/joinGame', data);
    this.startGame = (data) => instance.post('/startGame', data);
    this.skipLord = (data) => instance.post('/skipLord', data);
    this.callLord = (data) => instance.post('/callLord', data);
    this.skipPlay = (data) => instance.post('/skipPlay', data);
    this.doPlay = (data) => instance.post('/doPlay', data);
    this.restart = (data) => instance.post('/restart', data);
    this.quitGame = (data) => instance.post('/quitGame', data);
    const dataListeners = {};
    this.addDataListener = (eventName, listener) => {
        if (!dataListeners[eventName]) {
            dataListeners[eventName] = [];
        }
        return dataListeners[eventName].push(listener);
    };
    this.removeDataListener = (eventName, eventId) => {
        dataListeners[eventName][eventId] = null;
    };
    this.startGameEvent = userId => {
        const eventSource = new EventSource(`/game/gameEvent/${userId}`);
        eventSource.addEventListener('open', () => {
            console.log('Connected');
        }, false);
        eventSource.addEventListener('error', e => {
            if (e.target.readyState === EventSource.CLOSED) {
                console.log('Disconnected');
                Swal.fire({
                    type: 'error',
                    title: '连接已断开'
                })
            } else if (e.target.readyState === EventSource.CONNECTING) {
                console.log('Connecting...');
                Swal.fire({
                    type: 'error',
                    title: '重连中...'
                })
            }
        }, false);
        eventSource.onmessage = ({eventName, ...otherData}) => {
            const {eventListeners = []} = dataListeners[eventName];
            eventListeners.filter(listener => listener).forEach(listener => listener(otherData));
        };
        this.closeSse = () => eventSource.close();
    }
};

export default http