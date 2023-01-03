import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const apiPath = 'https://vue3-course-api.hexschool.io/v2/api/hexpotato';

const app = {
    data() {
        return {
            products: [],
            tempProduct: {},
        }
    },
    methods: {
        checkLogin() {
            //get token from cookie
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");

            // const token2 = document.cookie;

            console.log("check point token: ", token);
            // console.log("check point token2: ", token2);
            if (!token) {
                alert('請先登入');
                window.location = 'login.html';
            } else {
                this.getProducts();
            }
        },
        getProducts() {
            //get token from cookie
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            //set token to axios header
            axios.defaults.headers.common['Authorization'] = token;
            const url = `${apiPath}/admin/products`;
            axios.get(url).then((res) => {
                console.log(res);
                if (res.data.success) {
                    this.products = res.data.products;
                } else {
                    alert(res.data.message);
                }
            });
        },
        toggleEnabled(item, value) {
            console.log("check point toggle: ", item, value);
            item = value
        },
        showDetail(product) {
            this.tempProduct = { ...product }
        }
    },
    mounted() {
        this.checkLogin();
    }
}

createApp(app).mount('#app');