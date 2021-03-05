import {
    USER_INFO,
    GET_CATEGORY_LIST,
    GET_PRODUCT_ID,
} from './mutation-types'

export default {
    [USER_INFO](state, data) {
        state.menus = data.role ? data.role.menus :JSON.parse(localStorage.getItem('menus')) 
        state.userId = data._id,
            state.username = data.username,
            state.token = data.token
    },
    [GET_CATEGORY_LIST](state, data) {
        state.categoryList = data
    },
    [GET_PRODUCT_ID](state, id) {
        state.productId = id
    },
}