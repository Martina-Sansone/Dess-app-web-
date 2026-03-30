import Storage from './storage.js';

const SAMPLE_PRODUCTS = [
    {
        name: "Reloj Minimalista Cuarzo",
        price: 120.00,
        category: "Moda",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
        description: "Un reloj elegante con correa de cuero y esfera minimalista. Perfecto para cualquier ocasión.",
        id: "sample-1"
    },
    {
        name: "Auriculares Noise Cancelling",
        price: 250.00,
        category: "Electro",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
        description: "Sumérgete en tu música con la mejor cancelación de ruido del mercado.",
        id: "sample-2"
    },
    {
        name: "Lámpara de Diseño Nórdico",
        price: 85.00,
        category: "Hogar",
        image: "https://images.unsplash.com/photo-1507473884658-660c3a37593c?auto=format&fit=crop&w=400&q=80",
        description: "Ilumina tu espacio con estilo y calidez. Madera natural y acabados premium.",
        id: "sample-3"
    }
];

if (Storage.getProducts().length === 0) {
    Storage.saveProducts(SAMPLE_PRODUCTS);
}
