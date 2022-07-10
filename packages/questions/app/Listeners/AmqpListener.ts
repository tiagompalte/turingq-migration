import * as Amqp from 'amqp-ts'
import Env from '@ioc:Adonis/Core/Env'

export default abstract class AmqpListener {
  private mapEventToQueue(eventName: string) {
    if (eventName === 'new:question') {
      return [
        {
          name: Env.get('RABBITMQ_SUBSCRIPTIONS_REGISTRATION_QUEUE_NAME'),
          bindingKey: Env.get('RABBITMQ_SUBSCRIPTIONS_REGISTRATION_BINDING_KEY'),
        },
        {
          name: Env.get('RABBITMQ_SUBSCRIPTIONS_RANKING_QUESTION_QUEUE_NAME'),
          bindingKey: Env.get('RABBITMQ_SUBSCRIPTIONS_RANKING_QUESTION_BINDING_NAME'),
        },
      ]
    }

    return [
      {
        name: Env.get('RABBITMQ_SUBSCRIPTIONS_NEW_ANSWER_QUEUE_NAME'),
        bindingKey: Env.get('RABBITMQ_SUBSCRIPTIONS_NEW_ANSWER_BINDING_KEY'),
      },
      {
        name: Env.get('RABBITMQ_SUBSCRIPTIONS_RANKING_ANSWER_QUEUE_NAME'),
        bindingKey: Env.get('RABBITMQ_SUBSCRIPTIONS_RANKING_ANSWER_BINDING_NAME'),
      },
    ]
  }

  private getAmqpConfig(eventName: string) {
    const connInfo = {
      user: Env.get('RABBITMQ_CONNECTION_USER'),
      pass: Env.get('RABBITMQ_CONNECTION_PASSWORD'),
      host: Env.get('RABBITMQ_CONNECTION_HOST'),
      port: Env.get('RABBITMQ_CONNECTION_PORT'),
    }

    return {
      connectionUri: `amqp://${connInfo.user}:${connInfo.pass}@${connInfo.host}:${connInfo.port}`,
      exchangeName: Env.get('RABBITMQ_SUBSCRIPTIONS_EXCHANGE_NAME'),
      queue: this.mapEventToQueue(eventName),
    }
  }

  protected publishMessage(eventName: string, messageContent: Record<string, unknown>) {
    const amqpConfig = this.getAmqpConfig(eventName)
    const connection = new Amqp.Connection(amqpConfig.connectionUri)
    const exchange = connection.declareExchange(amqpConfig.exchangeName)
    amqpConfig.queue.forEach((queue) => {
      const declareQueue = connection.declareQueue(queue.name)
      declareQueue.bind(exchange, queue.bindingKey)
    })
    connection.completeConfiguration().then(() => {
      const alertMessage = new Amqp.Message(messageContent)
      amqpConfig.queue.forEach((queue) => exchange.send(alertMessage, queue.bindingKey))
    })
  }
}
