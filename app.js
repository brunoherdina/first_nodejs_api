const { response } = require("express");
const express = require("express");
const { randomUUID } = require("crypto");
const fs = require("fs");

const app = express();
app.use(express.json())

let products = [];

fs.readFile("products.json", "utf-8", (err, data) => {
    if(err) {
        console.log(err);
    } else {
        products = JSON.parse(data);
    }
})

app.post("/products", (req, res) => {
    const {name, price} = req.body;
    const product = {
        id : randomUUID(),
        name,
        price
    };

    products.push(product);

    updateProductFile();

    return res.json(product);
});

app.get("/products", (req, res) => {
    return res.json(products);
});

app.get("/products/:id", (req, res) => {
    const { id } = req.params;
    const product = products.find(product => product.id === id);

    return res.json(product);
});

app.put("/products/:id", (req, res) => {
    const { id } = req.params;
    const {name, price} = req.body;

    const productIndex = products.findIndex(product => product.id === id);
    products[productIndex] = {
        ...products[productIndex],
        name,
        price
    };

    updateProductFile();

    return res.json({ message : "Product updated"});
});

app.delete("/products/:id", (req, res) => {
    const { id } = req.params;

    const productIndex = products.findIndex(product => product.id === id);

    products.splice(productIndex, 1);

    updateProductFile();

    return res.json({ message : "Product deleted"});
});

function updateProductFile() {
    fs.writeFile("products.json", JSON.stringify(products), (err) => {
        if(err) {
            console.log(err);
        } else {
            console.log("Product file updated");
        }
    });
}

app.listen(4002, () => console.log("Server running on port 4002"));