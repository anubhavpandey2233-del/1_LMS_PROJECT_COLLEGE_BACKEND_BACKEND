const Cart = require("../model/cart.model");


const getAllCart = async (req, res) => {
    try {
        const CartAll = await Cart.find();

        if (!CartAll) {
            return res.status(400).json({ data: null, meassage: "AllCart Not Get" })
        }

        return res.status(200).json({ data: CartAll, meassage: "AllCart Get Sucessfully" })
    } catch (error) {
        return res.status(500).json({ data: null, meassage: "Internal Server Error: " + error.meassage })
    }
}

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);


        if (!cart) {
            return res.status(400).json({ data: null, message: "Cart Not get" })
        }

        res.status(200).json({ data: cart, message: 'Cart Sucessfully get' })
    } catch (error) {
        res.status(500).json({ data: null, message: "Internal Server Error: " + error.meassage })
    }
}

const addCart = async (req, res) => {
    try {
        const cart = await Cart.create(req.body)

        console.log("cart", cart);

        if (!cart) {
            return res.status(400).json({ data: null, message: "Cart Not added" })
        }

        res.status(200).json({ data: cart, message: 'Cart added Sucessfully' })
    } catch (error) {

        res.status(500).json({ data: null, message: "Internal Server Error: " + error.meassage })
    }
}

const deleteCart = async (req, res) => {
    try {
        const cart = await Cart.findByIdAndDelete(req.params.id);

        if (!cart) {
            return res.status(400).json({ data: null, message: "Cart Not Deleted" })
        }

        res.status(200).json({ data: cart, message: 'Cart Deleted Sucessfully' })
    } catch (error) {
        res.status(500).json({ data: null, message: "Internal Server Error: " + error.meassage })
    }
}

const upadateCart = async (req, res) => {
    try {

        const cart = await Cart.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        console.log(cart);

        if (!cart) {
            return res.status(400).json({ data: null, message: "Cart Not Upadte" })
        }

        res.status(200).json({ data: cart, message: 'Cart Sucess Update' })
    } catch (error) {
        res.status(500).json({ data: null, message: "Internal Server Error: " + error.meassage })
    }
}

module.exports = {
    deleteCart,
    upadateCart,
    addCart,
    getCart,
    getAllCart
}