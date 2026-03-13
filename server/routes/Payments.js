/*const express = require("express")
const router = express.Router()

// TEMPORARY - Use inline functions (NO controller imports)
router.post("/capturePayment", (req, res) => {
    res.json({ success: true, message: "capturePayment WORKS", orderId: "test_order" })
})

router.post("/verifyPayment", (req, res) => {
    res.json({ success: true, message: "Payment verified & enrolled!" })
})

module.exports = router*/

// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/Payments")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayment",auth, isStudent, verifyPayment)
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router