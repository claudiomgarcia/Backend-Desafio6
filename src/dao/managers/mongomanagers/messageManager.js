import messagesModel from '../../models/messages.model.js'

export default class MessageManager {

    async getMessages() {
        try {
            return await messagesModel.find().lean()
        } catch (error) {
            throw error
        }
    }

    async createMessage(message) {
        if (message.user.trim() === '' || message.message.trim() === '') {
            return null
        }

        try {
            return await messagesModel.create(message)
        } catch (error) {
            throw error
        }
    }

}