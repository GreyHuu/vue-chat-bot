/**
 * Vuex
 * http://vuex.vuejs.org/zh-cn/intro.html
 */
import Vue from 'vue';
import Vuex from 'vuex';
import fetch from "./fetch";

Vue.use(Vuex);

const now = new Date();
const store = new Vuex.Store({
    state: {
        // 当前用户
        user: {
            name: '病人',
            img: 'dist/images/1.jpg'
        },
        // 会话列表
        sessions: [
            {
                id: 1,
                user: {
                    name: '小鲸鱼',
                    img: 'dist/images/3.png'
                },
                messages: [
                    {
                        content: 'Hello，这里是小鲸鱼在线问诊平台, 有什么问题可以直接问我哦。',
                        date: now
                    }
                ]
            }
        ],
        // 当前选中的会话
        currentSessionId: 1,
        // 过滤出只包含这个key的会话
        filterKey: ''
    },
    mutations: {
        INIT_DATA(state) {
            let data = localStorage.getItem('yt');
            if (data) {
                state.sessions = JSON.parse(data);
            }
        },
        // 发送消息
        SEND_MESSAGE({sessions, currentSessionId}, content) {
            let session = sessions.find(item => item.id === currentSessionId);
            //自己的发送记录
            session.messages.push({
                content: content,
                date: new Date(),
                self: true
            });
            const response = fetch("/ask", {
                question: content
            });
            //回答记录
            response.then(res => {
                setTimeout(() => {
                    session.messages.push({
                        content: res.answer,
                        date: new Date(),
                        self: false
                    });
                }, 1000)
            })
        },
        // 选择会话
        SELECT_SESSION(state, id) {
            state.currentSessionId = id;
        },
        // 搜索
        SET_FILTER_KEY(state, value) {
            state.filterKey = value;
        }
    }
});

store.watch(
    (state) => state.sessions,
    (val) => {
        localStorage.setItem('yt', JSON.stringify(val));
    },
    {
        deep: true
    }
);

export default store;
export const actions = {
    initData: ({dispatch}) => dispatch('INIT_DATA'),
    sendMessage: ({dispatch}, content) => dispatch('SEND_MESSAGE', content),
    selectSession: ({dispatch}, id) => dispatch('SELECT_SESSION', id),
    search: ({dispatch}, value) => dispatch('SET_FILTER_KEY', value)
};
