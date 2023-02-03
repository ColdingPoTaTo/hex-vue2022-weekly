import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import pagination from './pagination.js';

const app = createApp({
    data() {
        return {
            products: [],
            tempProduct: { imagesUrl: [], },
            productModal: null,
            token: '',
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'hexpotato',
            page: {}
        }
    },
    methods: {
        checkLogin() {
            const url = `${this.apiUrl}/api/user/check`;
            axios.post(url)
                .then((res) => {
                    if (res.data.success) {
                        this.getProducts();
                    } else {
                        alert(res.data.success);
                    }
                })
                .catch((err) => {
                    alert('請先登入');
                    window.location = 'login.html';
                })
        },
        getProducts(page = 1) {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;
            if (page == 'all') {
                url += '/all'
            } else {
                url += `?page=${page}` //還沒使用到
                // category
            }
            axios.get(url).then((res) => {
                if (res.data.success) {
                    this.products = res.data.products;
                    this.page = res.data.pagination;
                } else {
                    alert(res.data.message);
                }
            });

        },
        showModal(action, product) {
            switch (action) {
                case 'add':
                    this.tempProduct = {
                        imagesUrl: [],
                    };
                    this.productModal.show();
                    break;
                case 'edit':
                    this.tempProduct = { ...product }
                    this.productModal.show();
                    break;
                case 'delete':
                    this.tempProduct = { ...product }
                    this.delProductModal.show();
                    break;
            }
        },
        saveProduct() {
            // const tempProduct = this.tempProduct;
            const isNewProduct = !this.tempProduct.id
            let httpMethod = 'post';
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            if (isNewProduct) { //增加 新產品

            } else { //更新 舊產品
                httpMethod = 'put'
                url += `/${this.tempProduct.id}`
            }
            axios[httpMethod](url, { data: this.tempProduct }).then((res) => {
                alert(res.data.message)
                this.getProducts()
                this.productModal.hide();
            }).catch((err) => {
                alert(err)
            })
        },
        deleteProduct(id) {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${id}`
            axios.delete(url).then((res) => {
                alert(res.data.message)
                this.getProducts();
            })
            this.delProductModal.hide();
        }
    },
    components: { pagination }, //分頁元件
    mounted() {
        this.token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = this.token;
        this.checkLogin();
        this.productModal = new bootstrap.Modal(document.getElementById('productModal'), { keyboard: false });
        this.delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), { keyboard: false });
    }
})

//產品modal元件
app.component('product-modal', {
    props: ['tempProduct', 'saveProduct'],
    template: '#product-modal-template',
})
//產品刪除modal元件
app.component('delete-modal', {
    props: ['tempProduct', 'deleteProduct'],
    template: '#delete-modal-template',
})

app.mount('#app');
