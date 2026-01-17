//该文件创建axios实例,用于和后端进行交互
import axios from 'axios'
import store from '../store/index.js'


//自定义配置
const instance = axios.create({
    timeout: 1000 * 10, //请求超时时间,这里设置为10秒
    baseURL: "http://47.106.72.70", //基础路径,这里使用了Vite的环境变量 http://47.106.72.70 http://localhost:8080
    validateStatus: (states) =>  states >= 200 && states <= 500 , //设置响应状态码, 这里设置为200-500都视为有效响应
    headers: {
        'Content-Type': 'application/json;charset=UTF-8' //设置浏览器和服务器通信的数据类型
    }
})

//拦截器: 在请求或响应被 then 或 catch 处理前拦截它们
/** axios.get('/xxx/xxx')
	.then(res=>{
		//处理调用成功时的结果
	})
	.catch(err=>{
		//调用失败时的处理
	})
*/
//也就是说,在处理调用成功或失败的结果之前,先经过拦截器,对请求或响应进行一些预处理
instance.interceptors.request.use((config) => {
    //在发送请求之前做些什么
    return config;
}, (error) => {
    //对请求错误做些什么
    return Promise.reject(error); /**这里着重讲讲Promise,
    Promise是ES6中新增的一个对象,它代表了一个异步操作的最终完成(或失败)及其结果值
    Promise有三种状态: pending(进行中), fulfilled(已成功)和 rejected(已失败)
    **/
}
)
//增加一个响应拦截器
instance.interceptors.response.use((response) => {
    //未登录(页面跳转在store文件中实现)
    if (response.status == 401) { //api文档中规定,未登录时,后端会返回401状态码
        const accountinfo = store.accountInfoStore()

        window.localStorage.removeItem('token') //清除本地存储的token
        window.localStorage.removeItem('accountinfo') //清除本地存储的用户信息

        accountinfo.logout() //调用store中的logout方法,清除用户信息和token
    }
    return response;
}, (error) => {
    //对响应错误做点什么
    //这里仅仅是测试代码,上线需要删除
    console.log('frontend/vite-project/src/api/instance.js响应错误拦截器:', error);
    console.log('frontend/vite-project/src/api/instance.js响应错误拦截器,错误信息:', error.message);
    console.log('frontend/vite-project/src/api/instance.js响应错误拦截器,错误状态码:', error.response?.status);
    console.log('frontend/vite-project/src/api/instance.js响应错误拦截器,响应错误:', error.response);
    return Promise.reject(error);
})
//自动在请求头加 token
instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}` //每次请求都会在请求头中加入Authorization字段,值为Bearer + token,前提是token存在
        // config.headers.Authorization = `${token}` //每次请求都会在请求头中加入Authorization字段,值为Bearer + token,前提是token存在
      }
      return config
    },
    (error) => Promise.reject(error)
)
//在这里可以说说吧token加载请求头的的作用, 首先token是用户登录后,后端返回给前端的一个字符串,它代表了用户的身份
//前端在每次向后端发送请求时,都需要在请求头中携带这个token,后端通过验证token来确认用户的身份
//如果没有携带token,或者token无效,后端会返回401状态码,表示未授权
//所以我们在请求拦截器中,自动在请求头中加上token,这样就不需要每次手动添加了

//token过期的自动获取(这里就先不实现了,等到项目完成后,如果有需要再说)
//可以实现token自动刷新,假设后端有一个刷新token的接口,我们可以在这里调用它


//向接口地址请求所用到的方法
const requestMethods = ['get', 'post']
const api = {}

requestMethods.forEach(method =>{
    //动态赋予api对象get和post两个方法 
    api[method] = (url, data, config) => { //赋予api对象get和post的有参方法,注意这里不要吧api[]理解为数组,之所以用[]是因为要动态赋值
        //得到的就是api.get(url, data, config)和api.post(url, data, config)两个方法
        return new Promise((resolve, reject) =>{ // 这里使用Promise,是为了让调用者可以使用then和catch来处理结果
            //resolve和reject是Promise的两个回调函数,分别用于处理成功和失败的情况
            instance[method](url,data,config) //注意这里的instance[method]也不是数组,而是动态调用axios实例的get或post方法 ,这是整个代码的核心,instance是带有统一配置的 axios 实例向后端发送请求,而不是裸axios
            //得到的就是 instance.get(url, data, config) 或 instance.post(url, data, config)
            //当然,instance.get()中并没有data参数,但是我们可以把data放在config中,例如 { params: data } ,这样就可以传递参数了

            //成功
            .then((request) => {
                resolve(request.data) //这里resolve的是request.data,也就是后端返回的数据,而不是整个response对象
            })
            //失败
            .catch((error) => {
                reject(error) //这里reject的是error对象,调用者可以通过catch来处理错误
            })
        })
    }
})
//最终 aip对象的内容是这样的
/** 
{
    get(url, data, config) => { return new Promise(...) },
    post(url, data, config) => { return new Promise(...) }
}
**/
//这样我们就可以通过 api.get() 和 api.post() 来发送请求了,而不是直接使用 axios.get() 和 axios.post()
//这样做的好处是,我们可以在这里统一处理请求和响应,例如添加拦截器,设置基础路径,处理错误等
//而不需要在每个请求中都重复这些代码
//举个简单的例子
// api.get('/user', { id: 1 })
// .then(data => {
//     console.log(data) //这里的data就是后端返回的数据
// })
// .catch(error => {
//     console.error(error) //这里的error就是请求失败的错误对象
// })

export default api 