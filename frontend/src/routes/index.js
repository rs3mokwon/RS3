import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/Login'
import join from '../components/Join'
import main from '../components/Main'
import map from '../components/Map'
import cctv from '../components/Cctv'


// import header from '../components/layout/Header'
// import home from '../components/Home'



Vue.use(Router)
export const router = new Router({
    mode: 'history',
    routes: [{
            path: '/', //경로
            name: 'login', // 경로의 이름
            component: login //이동할 컴포넌트
        },
        {
            path: '/join',
            name: 'join',
            component: join
        },
        {
            path: '/main',
            name: 'main',
            component: main,
        },
        {
            path: '/map',
            name: 'map',
            component: map,
        },
        {
            path: '/cctv',
            name: 'cctv',
            component: cctv,
        },
    ]
})