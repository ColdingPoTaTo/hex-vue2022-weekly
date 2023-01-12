import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const apiPath = 'https://vue3-course-api.hexschool.io/v2';

const app = {
    data() {
        return {
            user: {
                username: '',
                password: '',
            },
            defaultUser: {
                username: 'hexpotato@gmail.com',
                password: 'hex123456',
            },
            token: '',
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'hexpotato',

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
                    axios.defaults.headers.common['Authorization'] = token;
                    this.checkLogin();
                })
                .catch((err) => { alert(err.data.message) })
        },
        usingDemo() {
            this.user.username = this.defaultUser.username;
            this.user.password = this.defaultUser.password;
        },
        checkLogin() {
            const url = `${this.apiUrl}/api/user/check`;
            axios.post(url)
                .then((res) => {
                    if (res.data.success) {
                        window.location = 'products.html';
                    }
                })
                .catch((err) => {
                })
        },
    },
    mounted() {
        this.token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = this.token;
        this.checkLogin();
    }
}

createApp(app).mount('#app');