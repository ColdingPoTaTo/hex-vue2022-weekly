// import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const { createApp } = Vue;
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'hexpotato';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max, digits } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);
defineRule('digits', digits);


configure({
    generateMessage: VeeValidateI18n.localize("zh_TW"), // 切換成中文版
    //validateOnInput: true, // 輸入文字時，就立即進行驗證
});


const productModal = {
    props: ['id', 'addToCart'], // 這裡的id是從父層傳過來的，當id改變時，會觸發watch取得遠端資料，並呈現modal
    data() {
        return {
            modal: {},
            tempProduct: {},
            qty: 1,
        }
    },
    methods: {
        getProductById() {
            axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
                .then(res => {
                    console.log("check point getProductById: ", res.data);
                    this.tempProduct = res.data.product;
                })
        },
        showModal() {
            this.modal.show();
        },
        hideModal() {
            this.modal.hide();
        }
    },
    mounted() {
        this.modal = new bootstrap.Modal(document.getElementById('productModal'))
    },
    watch: {
        id() {
            if (this.id == '') return;
            this.getProductById();
            this.showModal()
        }
    },
    template: '#userProductModal'
};

const app = createApp({
    data() {
        return {
            products: [],
            productId: '',
            cart: {},
            loadingItem: '',
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
        }
    },
    methods: {
        getProduct() {
            axios.get(`${apiUrl}/api/${apiPath}/products/all`)
                .then(res => {
                    this.products = res.data.products;
                })
        },
        openModal(id) {
            if (this.productId == id) {
                this.$refs.productModal.showModal();
            } else {
                this.productId = id;
            }

        },
        addToCart(product_id, qty = 1) {
            const data = {
                product_id,
                qty,
            };
            this.loadingItem = product_id;
            axios.post(`${apiUrl}/api/${apiPath}/cart`, { data })
                .then(res => {
                    this.$refs.productModal.hideModal();
                    this.getCart();
                    this.loadingItem = '';
                })

        },
        getCart() {
            axios.get(`${apiUrl}/api/${apiPath}/cart`)
                .then(res => {
                    this.cart = res.data.data;
                })
        },
        updateCart(item) {
            const data = {
                product_id: item.product.id,
                qty: item.qty,
            };
            this.loadingItem = item.id;
            axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data })
                .then(res => {
                    this.getCart();
                    this.loadingItem = '';
                })
        },
        deleteCart(item) {
            this.loadingItem = item.id;
            axios.delete(`${apiUrl}/api/${apiPath}/cart/${item.id}`)
                .then(res => {
                    this.getCart();
                    this.loadingItem = '';
                })
        },
        deleteCarts() {
            axios.delete(`${apiUrl}/api/${apiPath}/carts`)
                .then(res => {
                    this.getCart();
                })
        },
        onSubmit() {
            const url = `${apiUrl}/api/${apiPath}/order`;
            const order = this.form;
            axios.post(url, { data: order })
                .then((response) => {
                    alert(response.data.message);
                    this.$refs.form.resetForm(); // 重置表單
                    this.getCart();
                }).catch((err) => {
                    alert(err.response.data.message);
                });

        },
    },
    mounted() {
        this.getProduct();
        this.getCart();
    },
    components: {
        productModal,
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    }
});

app.mount('#app');