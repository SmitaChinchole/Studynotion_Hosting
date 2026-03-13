
/*const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const mongoose = require("mongoose");
const {paymentSuccessEmail} = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");

// ✅ FIXED: initiate the razorpay order
exports.capturePayment = async(req, res) => {
    console.log("🔍 DEBUG - courses:", req.body.courses);
    
    const {courses} = req.body;
    const userId = req.user?.id || "test-user-id";

    if(!courses || courses.length === 0) {
        return res.json({success:false, message:"Please provide Course Id"});
    }

    let totalAmount = 0;

    for(const course_id of courses) {
        let course;
        try{
            course = await Course.findById(course_id);
            if(!course) {
                return res.status(404).json({success:false, message:"Could not find the course: " + course_id});
            }

            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled && course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({success:false, message:"Student is already Enrolled"});
            }

            totalAmount += course.price || 499;
        }
        catch(error) {
            console.log("Course error:", error);
            return res.status(500).json({success:false, message:"Invalid course ID"});
        }
    }
    
    const currency = "INR";
    const options = {
        amount: totalAmount * 100,
        currency,
        receipt: `receipt_${Date.now()}`,
    }

    try{
        const paymentResponse = await instance.orders.create(options);
        console.log("✅ Order created:", paymentResponse.id);
        res.json({
            success: true,
            orderId: paymentResponse.id,
            amount: paymentResponse.amount,
            currency: paymentResponse.currency,
            key_id: process.env.RAZORPAY_KEY_ID
        });
    }
    catch(error) {
        console.log("Order error:", error);
        return res.status(500).json({success:false, message:"Could not Initiate Order"});
    }
}

// ✅ FIXED: verify the payment
exports.verifyPayment = async(req, res) => {
    console.log("🔍 VERIFY - req.body:", req.body);
    
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user?.id || "test-user-id";

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
        return res.status(400).json({success:false, message:"Payment Failed - Missing data"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if(expectedSignature === razorpay_signature) {
        await enrollStudents(courses, userId);  // ✅ REMOVED 'res' param
        return res.status(200).json({success:true, message:"Payment Verified ✅"});
    }
    return res.status(400).json({success:false, message:"Payment Failed"});
}

// ✅ FIXED: DELETE THIS UNUSED FUNCTION
// const enrolledStudents = async(courses, userId, res) => { ... }  // ❌ DELETE

// ✅ FIXED: Main enrollment function - USES "courses" FIELD
const enrollStudents = async(courses, userId) => {
    if(!courses || !userId) {
        console.log("❌ enrollStudents - Missing data");
        return;
    }

    for(const courseId of courses) {
        try {
            // Update Course.studentsEnrolled
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id: courseId},
                {$push: {studentsEnrolled: userId}},
                {new: true}
            );

            if(!enrolledCourse) {
                console.log("❌ Course not found:", courseId);
                continue;
            }

            //added
            const courseProgress = await CourseProgress.create({
                courseID:courseId,
                userId:userId,
                completedVideos: [],
            })
    

            // ✅ FIXED 1: Fetch user BEFORE update
            /*const enrolledStudent = await User.findById(userId);
            if(!enrolledStudent) {
                console.log("❌ User not found:", userId);
                continue;
            }*

                //added
            const enrolledStudent = await User.findByIdAndUpdate(userId,
            {$push:{
                 courses: courseId,
                courseProgress: courseProgress._id,
            }},{new:true})

            // ✅ FIXED 2: CORRECT FIELD - "courses" (Dashboard reads this!)
            await User.findByIdAndUpdate(userId, {
                $push: { courses: courseId }  // 🎯 THIS WAS "enrolledCourses" ❌
            }, {new: true});

            // ✅ FIXED 3: Send email
            try {
                await mailSender(
                    enrolledStudent.email,
                    `Successfully Enrolled into ${enrolledCourse.courseName}`,
                    courseEnrollmentEmail(
                        enrolledCourse.courseName, 
                        enrolledStudent.firstName
                    )
                );
                console.log("✅ ENROLLMENT EMAIL SENT:", enrolledStudent.email);
            } catch (emailError) {
                console.log("⚠️ EMAIL FAILED:", emailError.message);
            }
            
        } catch(error) {
            console.log("❌ Enrollment error for course", courseId, ":", error.message);
        }
    }
};

exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;
    const userId = req.user?.id || "test-user-id";

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({success:false, message:"Please provide all the fields"});
    }

    try{
        const enrolledStudent = await User.findById(userId);
        if(!enrolledStudent) {
            return res.status(404).json({success:false, message:"User not found"});
        }
        
        await mailSender(
            enrolledStudent.email,
            `Payment Received - ₹${amount/100}`,
            paymentSuccessEmail(enrolledStudent.firstName, amount/100, orderId, paymentId)
        );
        return res.status(200).json({success:true, message:"Payment success email sent ✅"});
    }
    catch(error) {
        console.log("Email error:", error);
        return res.status(500).json({success:false, message:"Could not send email"});
    }
};*/


const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress"); // ✅ adjust path if needed
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const mongoose = require("mongoose");
const crypto = require("crypto");


// =======================
// 1) CREATE ORDER
// =======================
exports.capturePayment = async (req, res) => {
  try {
    console.log("🔍 DEBUG - courses:", req.body.courses);

    const { courses } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide Course Id" });
    }

    let totalAmount = 0;

    // Fetch user once
    const user = await User.findById(userId).select("courses");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    for (const courseId of courses) {
      try {
        const course = await Course.findById(courseId);
        if (!course) {
          return res.status(404).json({
            success: false,
            message: "Could not find the course: " + courseId,
          });
        }

        // ✅ Check on user.courses (same array UI uses)
        if (user.courses.map(String).includes(String(courseId))) {
          return res.status(200).json({
            success: false,
            message: "Student is already Enrolled",
          });
        }

        totalAmount += course.price || 499;
      } catch (error) {
        console.log("Course error:", error);
        return res.status(500).json({ success: false, message: "Invalid course ID" });
      }
    }

    const currency = "INR";
    const options = {
      amount: totalAmount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const paymentResponse = await instance.orders.create(options);
    console.log("✅ Order created:", paymentResponse.id);

    return res.json({
      success: true,
      orderId: paymentResponse.id,
      amount: paymentResponse.amount,
      currency: paymentResponse.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log("Order error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not Initiate Order",
    });
  }
};


// =======================
// 2) VERIFY PAYMENT
// =======================
exports.verifyPayment = async (req, res) => {
  try {
    console.log("🔍 VERIFY - req.body:", req.body);

    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses; // must be [courseId,...]
    const userId = req.user?.id;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses ||
      !Array.isArray(courses) ||
      courses.length === 0 ||
      !userId
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment Failed - Missing data",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment Failed" });
    }

    // Signature OK → enroll
    await enrollStudents(courses, userId);

    return res.status(200).json({
      success: true,
      message: "Payment Verified ✅",
    });
  } catch (error) {
    console.log("Verify error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};


// =======================
// 3) ENROLL STUDENTS
// =======================
const enrollStudents = async (courses, userId) => {
  if (!courses || !userId) {
    console.log("❌ enrollStudents - Missing data");
    return;
  }

  for (const courseId of courses) {
    try {
      // 1) Update Course.studentsEnrolled
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        {
          $addToSet: {
            studentsEnrolled: new mongoose.Types.ObjectId(userId),
          },
        },
        { new: true }
      );

      if (!enrolledCourse) {
        console.log("❌ Course not found:", courseId);
        continue;
      }

      // 2) Create CourseProgress
      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      // 3) Update User.courses and courseProgress (single update)
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      if (!enrolledStudent) {
        console.log("❌ User not found:", userId);
        continue;
      }

      // 4) Send enrollment email
      try {
        await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(
            enrolledCourse.courseName,
            enrolledStudent.firstName
          )
        );
        console.log("✅ ENROLLMENT EMAIL SENT:", enrolledStudent.email);
      } catch (emailError) {
        console.log("⚠️ EMAIL FAILED:", emailError.message);
      }
    } catch (error) {
      console.log("❌ Enrollment error for course", courseId, ":", error.message);
    }
  }
};


// =======================
// 4) PAYMENT SUCCESS EMAIL
// =======================
exports.sendPaymentSuccessEmail = async (req, res) => {
  try {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user?.id;

    if (!orderId || !paymentId || !amount || !userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the fields",
      });
    }

    const enrolledStudent = await User.findById(userId);
    if (!enrolledStudent) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await mailSender(
      enrolledStudent.email,
      `Payment Received - ₹${amount / 100}`,
      paymentSuccessEmail(
        enrolledStudent.firstName,
        amount / 100,
        orderId,
        paymentId
      )
    );

    return res.status(200).json({
      success: true,
      message: "Payment success email sent ✅",
    });
  } catch (error) {
    console.log("Email error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not send email",
    });
  }
};





































