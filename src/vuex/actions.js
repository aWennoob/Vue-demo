
import router from '../routers/index'
import { USER_INFO ,
    GET_CATEGORY_LIST,
} from './mutation-types'
import {
    reqLogin,
    reqCategory,
} from '../api/index'
export default {
    async getUserInfo({ commit }, { username, password }) {
        let result = await reqLogin(username, password)
        if (result.status === 0) {
            localStorage.setItem('menus',JSON.stringify(result.data.role.menus) )
            localStorage.setItem('token_key', result.data.token)
            commit(USER_INFO, result.data)
            router.replace('/admin')
        } else {
            alert('用户名或者密码错误!')
        }
    },
    async getCategoryList({commit}){
        let res=await reqCategory()
        if(res.status===0){
            commit(GET_CATEGORY_LIST,res.data)
        }else alert('获取分类列表失败')
    },
}