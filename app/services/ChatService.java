package services;

import lombok.NoArgsConstructor;
import models.Chat;
import models.People;

import java.util.List;

@NoArgsConstructor
public class ChatService {


    public List<Chat> getAllMessages() {
        return Chat.find.query().fetch("user").findList();
    }

    public List<Chat> getMessagesByUser(People user) {
        return Chat.find.query().fetch("user").where().eq("user", user).findList();
    }

    public Chat getMessageById(Long id) {
        return Chat.find.byId(id);
    }

    public void saveMessage(Chat chat) {
        chat.save();
    }

    public void updateMessage(Chat chat) {
        chat.update();
    }

    public void deleteMessage(Chat chat) {
        chat.delete();
    }
}