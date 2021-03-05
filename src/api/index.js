import ajax from './myAjax'

//登录请求
export const reqLogin = (username, password) => {
    return ajax({
        method: 'post',
        url: '/login',
        data: { username, password }
    })
}
//自动登录请求
export const autoLogin = () => ajax({
    method: 'get',
    url: 'auto_login',
    headers: { needToken: true }
})
//获得分类列表
export const reqCategory = () => ajax.get('/manage/category/list')
//添加分类
export const reqAddCategory = (categoryName) => ajax.post('/manage/category/add', { categoryName })
//修改分类
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax.post('/manage/category/update', {
    categoryId,
    categoryName
})
//删除分类
export const reqDeleteCategory = (categoryId) => ajax.post('/manage/category/delete', { categoryId })
//添加产品
export const reqAddProduct = (product) => ajax.post('/manage/product/add', product)
//获得产品列表
export const reqProducts = (pageNum, pageSize) => ajax.get('/manage/product/list', {
    params: {//包含所有的query参数
        pageNum,
        pageSize
    }
})
//根据Name/desc搜索产品分页列表
export const reqSearchProducts = ({
    pageNum,
    pageSize,
    searchName,
    searchType
}) => ajax.get('/manage/product/search', {
    params: {
        pageNum,
        pageSize,
        [searchType]: searchName,
    }
})
//对商品进行上架/下架处理
export const reqUpdateStatus = (productId, status) => ajax.post('/manage/product/updateStatus', {
    productId,
    status
})
//根据商品id获取商品对象
export const reqProductInfo = (productId) => ajax.get('/manage/product/info', { params: { productId } })
//根据分类id获取分类
export const reqCategoryById = (categoryId) => ajax.get('/manage/category/info', { params: { categoryId } })
//更新产品
export const reqUpdateProduct = (product) => ajax.post('/manage/product/update', product)
//获得角色列表
export const reqRoles = () => ajax.get('/manage/role/list')
//添加角色
export const reqAddRole = (roleName) => ajax.post('/manage/role/add', { roleName })
//更新角色权限
export const reqUpdateRole = (role)=>ajax.post('/manage/role/update',role);
//获得用户列表
export const reqUsers=()=>ajax.get('/manage/user/list')
//修改用户
export const reqUpdateUser = (user)=>ajax.post('/manage/user/update',user)
//添加用户
export const reqAddUser = (user)=>ajax.post('/manage/user/add',user)
//删除用户
export const reqDeleteUser = (userId)=>ajax.post( '/manage/user/delete',{userId})