import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const apiPath = 'https://vue3-course-api.hexschool.io/v2';

const app = {
    data() {
        return {
            user: {
                username: 'aa',
                password: 'a',
            },
            defaultUser: {
                username: 'hexpotato@gmail.com',
                password: 'hex123456',
            }

        }
    },
    methods: {
        login() {
            console.log('login: ' + `username: ${this.user.username}, password: ${this.user.password}`);
            const url = `${apiPath}/admin/signin`;
            axios.post(url, this.user)
                .then((res) => {
                    const { token, expired } = res.data;
                    //將token與expired存入cookie
                    document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`;
                    //將頁面導向產品頁面
                    window.location = 'products.html';

                })
                .catch((err) => { console.log("check point err: ", err) })
        },
        usingDemo() {
            this.user.username = this.defaultUser.username;
            this.user.password = this.defaultUser.password;
        }
    },
}

createApp(app).mount('#app');