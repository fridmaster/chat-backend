import {Message} from './message.model'

export class MessageController{
    public getMessageList(){
       return Message.findAll<Message>({ limit: 10, order: [['updatedAt', 'DESC']]}).then((messages)=>{
            return messages;
        })
    }

    public saveMessage(newMessage){
        
        return Message.create(newMessage).then(message=>{
            return message
        })

    }
}