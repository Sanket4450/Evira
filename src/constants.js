module.exports = {
  MESSAGES: {
    USER_EXISTS_WITH_EMAIL: 'User already exists with this email',
    USER_EXISTS_WITH_MOBILE: 'User already exists with this mobile',
    USER_NOT_EXIST: 'User does not exist with this email or mobile',
    INCORRECT_PASSWROD: 'Incorrect password',
    USER_NOT_FOUND: 'User not found',
    ADMIN_NOT_FOUND: 'Admin User not found',
    INCORRECT_OTP: 'Incorrect OTP',
    SOMETHING_WENT_WRONG: 'Something went wrong, please try again',
    AUTHENTICATION_FAILED: 'Authentication failed',
    TOKEN_IS_REQUIRED: 'Token is required',
    INVALID_TOKEN: 'Invalid token or signature',
    TOKEN_EXPIRED: 'Token has expired',
    RESET_PASSWORD: 'Reset Password',
    INVALID_SECRET: 'Invalid admin secret, admin authentication failed!',
    EMAIL_RENDER_ERROR: 'Error rendering email template',
    EMAIL_SEND_ERROR: 'Error sending email',
    NOT_ALLOWED: 'You are not allowed to access this resource',
    NOTIFICATION_NOT_FOUND:
      'Notification not found for this user or notificationId',
    ENTER_VALID_CATEGORY: 'Please enter valid category',
    CATEGORY_NOT_FOUND: 'Category not found for this categoryId',
    CATEGORY_NAME_TAKEN: 'Category name is already taken!',
    PRODUCTS_NOT_FOUND: 'Products not found for this category',
    PRODUCT_NOT_FOUND: 'Product not found for this productId',
    PRODUCT_NAME_TAKEN: 'Product name is already taken!',
    VARIANT_NOT_FOUND: 'Variant not found for this product or variantId',
    VARIANT_NAME_TAKEN: 'Variant name is already taken!',
    OFFER_NOT_FOUND: 'Offer not found for this offerId',
    OFFER_ALREADY_EXISTS: 'An offer already exists with this product',
    REVIEW_NOT_FOUND: 'Review not found for this reviewId',
    CANNOT_POST_REVIEW: 'Cannot post review to incompleted order',
    REVIEW_ALREADY_POSTED: 'Review already posted by you on this product',
    USER_NOT_ALLOWED: 'User is not allowed to modify this resource',
    TOGGLE_FIELD_MISSING: 'Please enter the toggle field',
    ENTER_VALID_ACTION: 'Please enter a valid cart action',
    NOT_HAVE_ENOUGH_QUANTITY: 'Not have enough quantity for this product',
    ADD_PRODUCT_TO_CART: 'Please first add product to cart',
    ADDRESS_NOT_FOUND: 'Address not found for this user or addressId',
    DEFAULT_ADDRESS: 'You cannot perform this action on default address',
    SHIPPING_NOT_FOUND: 'Shipping-type not found with this Id',
    SHIPPING_TITLE_TAKEN: 'Shipping title is already taken!',
    ENTER_VALID_OBJECTID: 'Invalid ID. Please provide a valid ObjectId',
    PROMO_NOT_FOUND: 'Promo-code not found with this promoId',
    PROMO_EXPIRED: 'Promo-code expired',
    PROMO_CODE_TAKEN: 'Promo-code is already taken!',
    INCORRECT_PIN: 'Incorrect PIN. Please enter correct PIN',
    ORDER_NOT_FOUND: 'Order not found for this user or orderId',
    ADD_PRODUCTS: 'Please add products into cart first to checkout',
    AMOUNT_NOT_MATCHED: 'Amount not match! please check the total amount',
    PAYMENT_METHOD_NOT_FOUND:
      'Payment-method not found for this user or paymentId',
    PAYMENT_METHOD_EXPIRED:
      'Payment-method expired, please add a new payment-method',
    INSUFFICIENT_BALANCE: 'Not have sufficient balance',
    ORDER_ALREADY_CANCELED: 'Order already canceled',
    STATUS_ALREADY_UPDATED: 'Order-status already updated',
    ERROR_UPLOADING_FILE: 'Error uploading file',
    INVALID_TYPE: 'Invalid type',
  },
  COLLECTIONS: {
    USER: 'User',
    PRODUCT: 'Product',
    VARIANT: 'Variant',
    CATEGORY: 'Category',
    REVIEW: 'Review',
    NOTIFICATION: 'Notification',
    WISHLIST: 'Wishlist',
    OFFER: 'Offer',
    CART: 'Cart',
    ORDER: 'Order',
    ADDRESS: 'Address',
    PROMOTION: 'Promotion',
    SHIPPINGTYPE: 'ShippingType',
    FAQ: 'FAQ',
    MESSAGE: 'Message',
  },
  FOLDERS: {
    CATEGORY: 'Category_icons',
    PRODUCT: 'Product_images',
    OFFER: 'Offer_images',
    NOTIFICATION: 'Notification_images',
    USER: 'User_profile_images',
  },
  NOTIFICATIONS: {
    USER: 'https://firebasestorage.googleapis.com/v0/b/evira-b42be.appspot.com/o/notifications%2FAuto%20Layout%20Horizontal%20(4).png?alt=media&token=51c51383-109c-40a1-91e0-d622b064ab78',
    DISCOUNT:
      'https://firebasestorage.googleapis.com/v0/b/evira-b42be.appspot.com/o/notifications%2FAuto%20Layout%20Horizontal.png?alt=media&token=89119952-c5d3-499e-a8a4-0bb50381d2f0',
    LOCATION:
      'https://firebasestorage.googleapis.com/v0/b/evira-b42be.appspot.com/o/notifications%2FAuto%20Layout%20Horizontal%20(2).png?alt=media&token=b57aea2a-481e-43e5-82f4-0f4f97d40e25',
    WALLET:
      'https://firebasestorage.googleapis.com/v0/b/evira-b42be.appspot.com/o/notifications%2FAuto%20Layout%20Horizontal%20(1).png?alt=media&token=f01e7334-a9b8-4bce-bcc5-7f9e7bf3ccc3',
    CARD: 'https://firebasestorage.googleapis.com/v0/b/evira-b42be.appspot.com/o/notifications%2FAuto%20Layout%20Horizontal%20(3).png?alt=media&token=12e33873-09ab-407d-865a-9943ff11ce05',
    DELIVERY:
      'https://firebasestorage.googleapis.com/v0/b/evira-b42be.appspot.com/o/notifications%2FAuto%20Layout%20Horizontal%20(5).png?alt=media&token=2f6f60a9-104a-4014-af96-ad4b34d1debc',
    PROMOCODE:
      'https://firebasestorage.googleapis.com/v0/b/evira-b42be.appspot.com/o/notifications%2FGroup%204.png?alt=media&token=ed3d4ad1-269a-4970-87f5-5507658da406',
  },
}
