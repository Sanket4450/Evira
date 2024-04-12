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
    FILE_NOT_FOUND: 'File not found',
    FILE_TYPE_NOT_SUPPORTED: 'File type not supported',
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
    NOTIFICATION: 'Notification_icons',
    USER: 'User_profile_images',
  },
  NOTIFICATIONS: {
    USER: 'https://evira-images.s3.amazonaws.com/Notification_icons/user.png',
    DISCOUNT:
      'https://evira-images.s3.amazonaws.com/Notification_icons/discount.png',
    LOCATION:
      'https://evira-images.s3.amazonaws.com/Notification_icons/location.png',
    WALLET:
      'https://evira-images.s3.amazonaws.com/Notification_icons/wallet.png',
    CARD: 'https://evira-images.s3.amazonaws.com/Notification_icons/card.png',
    DELIVERY:
      'https://evira-images.s3.amazonaws.com/Notification_icons/delivery.png',
    PROMOCODE:
      'https://evira-images.s3.amazonaws.com/Notification_icons/promocode.png',
  },
}
