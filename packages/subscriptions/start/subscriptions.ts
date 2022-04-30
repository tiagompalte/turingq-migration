// Você já conhece esses imports:
import * as Amqp from 'amqp-ts'
import Env from '@ioc:Adonis/Core/Env'
import Event from '@ioc:Adonis/Core/Event'

// Este "type" é apenas para os ajudar com o manuseio de tipos
// no TypeScript. Você pode ignorá-lo por agora:
type AmqpConfig = {
  connectionUri: string
  exchangeName: string
  queues: {
    registration: string
    newAnswer: string
  }
  bindingKeys: {
    registration: string
    newAnswer: string
  }
}

// Esta função é bem parecida com o que fizemos no
// microsserviço de "questions". Há poucas alterações,
// mas você deve ser capaz de entendê-la rapidamente
// ao ler o código. Você já deve até entender para que
// precisaremos dela:
function getAmqpConfig(): AmqpConfig {
  const connInfo = {
    user: Env.get('RABBITMQ_CONNECTION_USER'),
    pass: Env.get('RABBITMQ_CONNECTION_PASSWORD'),
    host: Env.get('RABBITMQ_CONNECTION_HOST'),
    port: Env.get('RABBITMQ_CONNECTION_PORT'),
  }

  return {
    connectionUri: `amqp://${connInfo.user}:${connInfo.pass}@${connInfo.host}:${connInfo.port}`,
    exchangeName: Env.get('RABBITMQ_SUBSCRIPTIONS_EXCHANGE_NAME'),
    queues: {
      registration: Env.get('RABBITMQ_SUBSCRIPTIONS_REGISTRATION_QUEUE_NAME'),
      newAnswer: Env.get('RABBITMQ_SUBSCRIPTIONS_NEW_ANSWER_QUEUE_NAME'),
    },
    bindingKeys: {
      registration: Env.get('RABBITMQ_SUBSCRIPTIONS_REGISTRATION_BINDING_KEY'),
      newAnswer: Env.get('RABBITMQ_SUBSCRIPTIONS_NEW_ANSWER_BINDING_KEY'),
    },
  }
}

async function listen(amqpConfig: AmqpConfig) {
  const connection = new Amqp.Connection(amqpConfig.connectionUri)
  const exchange = connection.declareExchange(amqpConfig.exchangeName)

  const registrationQueue = connection.declareQueue(amqpConfig.queues.registration)
  const newAnswerQueue = connection.declareQueue(amqpConfig.queues.newAnswer)

  registrationQueue.bind(exchange, amqpConfig.bindingKeys.registration)
  newAnswerQueue.bind(exchange, amqpConfig.bindingKeys.newAnswer)

  registrationQueue.activateConsumer((message) => {
    Event.emit('subscription:create', message.getContent())
    message.ack()
  })

  newAnswerQueue.activateConsumer((message) => {
    Event.emit('answer:arrival', message.getContent())
    message.ack()
  })
}

listen(getAmqpConfig())
