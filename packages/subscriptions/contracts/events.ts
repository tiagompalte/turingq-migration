declare module '@ioc:Adonis/Core/Event' {
  interface EventsList {
    'answer:arrival': {
      question: {
        id: string
        title: string
      }
      answer: {
        id: string
        body: string
      }
    }

    'subscription:create': {
      question: {
        id: string
      }
      subscriber: {
        id: string
        email: string
      }
    }
  }
}
