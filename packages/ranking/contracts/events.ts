declare module '@ioc:Adonis/Core/Event' {
  interface EventsList {
    'answer:arrival': {
      question: {
        authorId: string
      }
    }

    'question:arrival': {
      subscriber: {
        id: string
      }
    }
  }
}
