const { secret } = require("../config/secret");
const stripe = require("stripe")(secret.stripe_key);
const Order = require("../model/Order");
const { processPayment } = require("../services/payment.service");

exports.paymentIntent = async (req, res, next) => {
  try {
    const product = req.body;
    
    if (!product.price) {
      return res.status(400).json({
        success: false,
        message: "Price is required"
      });
    }
    
    const price = Number(product.price);
    const amount = price * 100;
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: amount,
      payment_method_types: ["card"],
    });
    
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Process payment with multiple methods
exports.processOrderPayment = async (req, res, next) => {
  try {
    const { paymentMethod, orderData } = req.body;
    
    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required"
      });
    }
    
    if (!orderData) {
      return res.status(400).json({
        success: false,
        message: "Order data is required"
      });
    }
    
    const paymentResult = await processPayment(paymentMethod, orderData);
    
    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        message: paymentResult.error
      });
    }
    
    res.status(200).json({
      success: true,
      data: paymentResult
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addOrder = async (req, res, next) => {
  try {
    const orderData = req.body;
    if (!orderData.user) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }
    
    if (!orderData.products || orderData.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products are required"
      });
    }
    
    if (!orderData.total || orderData.total <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid total amount is required"
      });
    }

    const orderItems = await Order.create(orderData);

    res.status(200).json({
      success: true,
      message: "Order added successfully",
      order: orderItems,
    });
  }
  catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orderItems = await Order.find({}).populate('user');
    res.status(200).json({
      success: true,
      data: orderItems,
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};

exports.getSingleOrder = async (req, res, next) => {
  try {
    const orderItem = await Order.findById(req.params.id).populate('user');
    res.status(200).json(orderItem);
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const newStatus = req.body.status;
    const orderId = req.params.id;
    
    if (!newStatus) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required"
      });
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { status: newStatus } },
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      order: updatedOrder
    });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
