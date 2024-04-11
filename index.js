const notificationBody = {
  title: 'Account Setup!',
  message: 'Your account has been created successfully',
  icon: constant.NOTIFICATIONS.USER,
}

await notificationService.createNotification(user._id, notificationBody)
