import axios from 'axios'
import qs from 'qs';
import router from '../routers/index'

const instance = axios.create({
    timeout: 2000,
    baseURL: '/api',
})

instance.interceptors.request.use((config) => {
    // 得到请求方式和请求体数据
    const { method, data } = config
    // 处理post请求, 将data对象转换成query参数格式字符串
    if (method.toLowerCase() === 'post' && typeof data === 'object') {
        config.data = qs.stringify(data) // username=admin&password=admin      
    }
    //使用token实现自动登录
    let token = localStorage.getItem('token_key')
    if (config.headers.needToken) {
        if (token) {
            config.headers.authorization = token
        } else {
            throw Error('请先登录')
        }
    }

    return config
})

instance.interceptors.response.use((response) => {
    return response.data
}, (e) => {
    alert('myAjax请求失败', e.message)
    //token没有的情况
    if (!e.response) {
        alert('请先登录')
        if (router.currentRoute !== '/login') router.replace('/login')
    } else if (e.response.status === 401) {
        alert('token过期，请重新登录')
        if (router.currentRoute !== '/login') router.replace('/login')
    } else { alert('请求失败') }

    return new Promise(() => { })
})

export default instance