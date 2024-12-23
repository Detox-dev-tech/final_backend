const express = require("express");


// new_addition_inventory Management
const {
  createInventoryItem,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryItemByName
} = require("../controllers/inventoryController");

const {
  sendMessage
} = require("../controllers/chatController");

const {
  customerRegister,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomer,
  getCustomerByToken,
  getCustomerLocation,
  updateFCMToken,
  getWarrantyDetails,
} = require("../controllers/customerController");

const router = express.Router();

const db = require("../utils/database");
const {
  viewAllOrders,
  createOrder,
  declineOrder,
  pendingOrdersCount,
  completedOrdersCount,
  ongoingOrdersCount,
  viewCompletedOrderHistory,
  getOrderCountsByDate,
  viewRequestDetail,
  assignTechnician,
  getOrderDetail,
  acceptOrder,
  invoiceOrder,
  markOrderCompleted,
  createReview,
  cancelOrder,
  viewOrderStatusStatistics,//new
  viewProblemStatistics,//new
  viewCompletedOrderSales,//new
  viewTopSpareParts, //new
  viewCancelledOrderHistory, // new_addition cancelled
  getOrderById,// new_addition
  deleteOrder,// new_addition_inventory Management
  viewOrdersDetail,
  getPendingOrders,
  viewReview,
  calculatePayment,
  getCompletedPicture,
  completePayment

} = require("../controllers/ordersController");
const { decodeToken } = require("../utils/authGuard");
const {
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  registerAdmin,// new_addition
  lastLogin,
  getLastLogin,
} = require("../controllers/authController");
const {
  createTechnician,
  getAllTechnicians,
  getTechnicianById,
  updateTechnician,
  deleteTechnician,
  getTechnicianByToken,
  updateFCMTokenTechnician,
  sendLocation,
  declineOrderForTechnician,
  changeTechnicianStatus,
  checkTechnicianAvailability,
} = require("../controllers/technicianController");
const {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
} = require("../controllers/bannerController");
const upload = require("../utils/imgUpload");

const { createRequestForm, checkAvailability, updateRequestFormStatus, getAllRequestForms, deleteRequestForm, getRequestFormById, getRequestFormsByTechnician, trackOrderStatus, getRequestFormByOrderId
} = require("../controllers/requestController");



// auth routes
router.post("/login", login);
router.post("/register-admin", registerAdmin);// new_addition
router.post("/change-password", decodeToken, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/last-login", lastLogin);
router.get("/fetch-last-login", getLastLogin);
// customer routes
router.post("/customer/register", customerRegister);
router.get("/technician/customersDetail/:id", getCustomer);
router.get("/customer/:token", getCustomerByToken);
router.get("/warranty-details", getWarrantyDetails);
router.post("/customer/:id", decodeToken, updateFCMToken);
//technician routes
router.get("/technician/:token", getTechnicianByToken);
router.post("/technician/:id", decodeToken, updateFCMTokenTechnician);
router.put("/technician/location/:id", decodeToken, sendLocation);
router.put("/technician/:id/decline-request", decodeToken, declineOrderForTechnician);
router.put("/technician/status/:id", decodeToken, changeTechnicianStatus);
router.get("/technician/check-overlap/:id", checkTechnicianAvailability);
router.get("/technician/request_part/:id", decodeToken, getRequestFormByOrderId);

// order routes
router.put("/orders/cancel/:id", decodeToken, cancelOrder);
router.get("/orders/pending", decodeToken, getPendingOrders);
router.get("/orders/details/:id", decodeToken, viewOrdersDetail);
router.get("/orders", decodeToken, viewAllOrders);
router.post("/orders", decodeToken, upload.single("image"), createOrder);
router.get("/orders/history", decodeToken, viewCompletedOrderHistory);
router.get("/orders/history/cancelled", decodeToken, viewCancelledOrderHistory);// new_addition
router.put("/orders/:id/decline-request", decodeToken, declineOrder);
router.put("/orders/:id/assign-technician", decodeToken, assignTechnician);
router.put("/orders/:id/accept", decodeToken, acceptOrder);
router.get("/orders/:id/invoice", decodeToken, invoiceOrder);
router.put('/complete-payment', completePayment);
router.get("/orders/problem-stats", decodeToken, viewProblemStatistics);//new
router.get("/orders/status-stats", decodeToken, viewOrderStatusStatistics);//new
router.get("/orders/completed-sales-stats", decodeToken, viewCompletedOrderSales);//new
router.get("/orders/spare-parts", decodeToken, viewTopSpareParts);//new
router.post('/calculate-payment/:id', calculatePayment);
router.put('/orders/:id/upload-image', decodeToken, upload.single('image'), getCompletedPicture);




router.get("/orders/:id", decodeToken, getOrderById);// new_addition
router.put("/orders/:id", decodeToken, createReview);// new_addition
router.delete("/orders/:id", decodeToken, deleteOrder);// new_addition

router.put(
  "/orders/:id/mark-complete/:technicianId",
  decodeToken,
  markOrderCompleted
);

router.get("/orders/review", decodeToken, viewReview);

router.get("/orders/:id/request-detail", decodeToken, viewRequestDetail);
router.get("/orders/pending/count", decodeToken, pendingOrdersCount);

router.get("/orders/completed/count", decodeToken, completedOrdersCount);
router.get("/orders/ongoing/count", decodeToken, ongoingOrdersCount);
// admin routes
router.post("/admin/technicians", decodeToken, createTechnician);
router.get("/admin/technicians", decodeToken, getAllTechnicians);
router.get("/admin/technicians/:id", decodeToken, getTechnicianById);
router.put("/admin/technicians/:id", decodeToken, updateTechnician);
router.delete("/admin/technicians/:id", decodeToken, deleteTechnician);
router.get("/admin/customers", decodeToken, getAllCustomers);
router.get("/admin/customers/:id", decodeToken, getCustomerById);
router.put("/admin/customers/:id", decodeToken, updateCustomer);
router.delete("/admin/customers/:id", decodeToken, deleteCustomer);
// banner routes
router.post("/banner", decodeToken, upload.single("image"), createBanner);
router.get("/admin/banner", decodeToken, getAllBanners);
router.get("/admin/banner/:id", decodeToken, getBannerById);
router.put("/admin/banner/:id", decodeToken, upload.single("image"), updateBanner);

// chat
router.post('/chat/sendMessage', sendMessage);

// request form // new_addition
router.post("/request", createRequestForm);
router.put("/request/:id", updateRequestFormStatus);
router.get('/request/availability', checkAvailability);
router.get("/request", getAllRequestForms);
router.delete("/request/:id", deleteRequestForm);
router.get("/request/:id", getRequestFormById);
router.get("/request/technician/:name", getRequestFormsByTechnician);
router.put('/request/technician/:technicianId/:orderId', trackOrderStatus);

// inventory// new_addition

// Inventory Routes // new_addition
router.post("/inventory", createInventoryItem);
router.get("/inventory", getAllInventoryItems);
router.get("/inventory/:id", getInventoryItemById);
router.put("/inventory/:id", updateInventoryItem);
router.delete("/inventory/:id", deleteInventoryItem);
router.get("/inventoryName/", getInventoryItemByName);



module.exports = router;
