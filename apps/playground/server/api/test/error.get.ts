export default defineEventHandler(async (event) => {
  const logger = useLogger(event)

  logger.set({
    user: { id: 'user_456', plan: 'free' },
    action: 'test_error',
  })

  await new Promise(resolve => setTimeout(resolve, 500))

  logger.error(new Error('Payment processing failed'), {
    paymentMethod: 'card',
    amount: 9999,
    reason: 'Card declined by issuer',
  })

  logger.emit()

  throw createError({
    statusCode: 400,
    message: 'Payment processing failed',
  })
})
