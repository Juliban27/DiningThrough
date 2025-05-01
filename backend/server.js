import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';


const app = express();


app.use(cors({
    origin: 'http://localhost:5173', // Permite solo este origen, puedes agregar más si es necesario
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    credentials: true, // Si necesitas enviar cookies o autenticación
    }));

app.use(express.json());

// Conectar a MongoDB Atlas
mongoose.connect('mongodb+srv://juliban27:WJSciYIQJLQGssen@diningthrough.x8uqu1i.mongodb.net/data_base', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));


const User = mongoose.model('User', {
    id: String,
    email: String,
    password: String,
    role: String,
    name: String,
});

const Product = mongoose.model('Product', {
    product_id: String,
    name: String,
    description: String,
    price: Number,
    stock: Number,
    alergies: Array,
    image: String,
    category: String,
    restaurant_id: String,
    calification: Number,
});

const Order = mongoose.model('Order', {
    order_id: String,
    client_id: String,
    punto_venta: String,
    products: Array,
    state: String,
    date: Date
});

const Bill = mongoose.model('Bill', {
    bill_id: String,
    client_id: String,
    products: Array,
    date: Date,
    total: Number,
});

const Restaurant = mongoose.model('Bill', {
    restaurant_id: String,
    name: String,
    location: String,
    image: String,
})


// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Backend funcionando');
});

// Ruta para obtener todos los usuarios
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    }catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
});

// Ruta para agregar un usuario
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar el usuario' });
    }
});


//Productos/////////////////////////////

// Ruta para obtener todos los productos
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Ruta para agregar un nuevo producto
app.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar el producto' });
    }
});

// Ruta para obtener un producto por su ID
app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Ruta para actualizar un producto
app.put('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Ruta para eliminar un producto
app.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

// Order//////////////////////////


// Ruta para obtener todos los pedidos
app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
});

// Ruta para agregar un nuevo pedido
app.post('/orders', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar el pedido' });
    }
});

// Ruta para obtener un pedido por su ID
app.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el pedido' });
    }
});

// Ruta para actualizar un pedido
app.put('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el pedido' });
    }
});

// Ruta para eliminar un pedido
app.delete('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });
        res.json({ message: 'Pedido eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el pedido' });
    }
});

////////Bills////////////

// Ruta para obtener todas las facturas
app.get('/bills', async (req, res) => {
    try {
        const bills = await Bill.find();
        res.json(bills);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las facturas' });
    }
});

// Ruta para agregar una nueva factura
app.post('/bills', async (req, res) => {
    try {
        const bill = new Bill(req.body);
        await bill.save();
        res.status(201).json(bill);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar la factura' });
    }
});

// Ruta para obtener una factura por su ID
app.get('/bills/:id', async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) return res.status(404).json({ error: 'Factura no encontrada' });
        res.json(bill);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la factura' });
    }
});

// Ruta para actualizar una factura
app.put('/bills/:id', async (req, res) => {
    try {
        const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!bill) return res.status(404).json({ error: 'Factura no encontrada' });
        res.json(bill);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la factura' });
    }
});

// Ruta para eliminar una factura
app.delete('/bills/:id', async (req, res) => {
    try {
        const bill = await Bill.findByIdAndDelete(req.params.id);
        if (!bill) return res.status(404).json({ error: 'Factura no encontrada' });
        res.json({ message: 'Factura eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la factura' });
    }
});



// Iniciar el servidor en el puerto 5000
app.listen(5000, () => {
    console.log('Servidor backend corriendo en http://localhost:5000');
});