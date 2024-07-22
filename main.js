import './style.css';
import Alpine from 'alpinejs';
import { DataProducts, getCategories } from './Api';

window.Alpine = Alpine;

document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        products: [],
        originalProducts: [],
        filteredProducts: [],
        categories: [],
        selectedCategory: '',
        sorting: 'default',
        loading: true,
        cart: [],
        modalOpen: false,
        selectedProduct: {},
        get cartCount() {
            return this.cart.length;
        },
        async init() {
            this.loading = true;
            try {
                const [products, categories] = await Promise.all([DataProducts(), getCategories()]);
                this.products = products;
                this.originalProducts = [...this.products];
                this.filteredProducts = [...this.products];
                this.categories = categories.response;
            } catch (error) {
                console.error('Error fetching products or categories:', error);
            } finally {
                this.loading = false;
            }
        },
        filterProducts() {
            if (this.selectedCategory) {
                this.filteredProducts = this.products.filter(product => product.category === this.selectedCategory);
            } else {
                this.filteredProducts = [...this.products];
            }
            this.sortProducts();
        },
        handleSort() {
            this.sortProducts();
        },
        sortProducts() {
            if (this.sorting === "low") {
                this.filteredProducts.sort((a, b) => a.price - b.price);
            } else if (this.sorting === "high") {
                this.filteredProducts.sort((a, b) => b.price - a.price);
            } else {
                this.filteredProducts = [...this.originalProducts];
                if (this.selectedCategory) {
                    this.filteredProducts = this.filteredProducts.filter(product => product.category === this.selectedCategory);
                }
            }
        },
        resetFilters() {
            this.selectedCategory = '';
            this.sorting = 'default';
            this.filteredProducts = [...this.originalProducts];
        },
        addToCart(product) {
            this.cart.push(product);
        },
        toggleNavbar() {
            this.navbarOpen = !this.navbarOpen;
        },
        openModal(productId) {
            this.selectedProduct = this.products.find(product => product.id === productId);
            this.modalOpen = true;
        },
        closeModal() {
            this.modalOpen = false;
        }
    }));
});

Alpine.start();
