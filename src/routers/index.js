import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Login from '../components/login.vue'
import Admin from '../components/admin.vue'

import Home from '../pages/home.vue'
import Application from '../pages/application.vue'
import Category from '../pages/category.vue'
import Chart from '../pages/chart.vue'
import Product from '../pages/product.vue'
import Role from '../pages/role.vue'
import User from '../pages/user.vue'
import AddProduct from '../pages/add_product.vue'
import DetailProduct from '../pages/detail_product.vue'
import UpdateProduct from '../pages/update_product.vue'
//解决addproduct路由渲染到product视图
import routeReplaceSelf from './routeReplaceSelf'

//解决路由bug NavigationDuplicated: Avoided redundant navigation to current location
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err)
}

export default new VueRouter({
    mode: 'history',
    routes: [
        { path: '/login', component: Login, name: 'login' },
        { path: '/', redirect: '/login' },
        {
            path: '/admin', component: Admin, children: [
                { path: 'home', component: Home, name: 'home', },
                {
                    path: 'application',component:Application, children: [
                        { path: 'category', component: Category, name: 'category' },
                        {
                            path: 'product', component: routeReplaceSelf(Product), name: 'product',
                            children: [
                                { path: 'addproduct', component: AddProduct },
                                { path: 'detailproduct', component: DetailProduct },
                                { path: 'updateproduct', component: UpdateProduct },
                            ]
                        },
                        // {path:'',redirect:'category'}
                    ]
                },
                { path: 'chart', component: Chart, name: 'chart' },
                { path: 'role', component: Role, name: 'role' },
                { path: 'user', component: User, name: 'user' },
                { path: '', redirect: { name: 'home' } }
            ]
        },
    ]

})