package controllers;

import actions.AuthenticatedAction;
import com.fasterxml.jackson.databind.JsonNode;
import play.libs.Json;
import models.Chat;
import models.People;
import play.mvc.*;
import utils.Security;
import services.ChatService;
import services.UserService;

import javax.inject.Inject;
import java.util.List;

public class ChatroomController extends Controller {

    private final ChatService chatService;
    private final UserService userService;

    @Inject
    public ChatroomController(ChatService chatService, UserService userService) {
        this.chatService = chatService;
        this.userService = userService;
    }

    @With(AuthenticatedAction.class)
    public Result index(Http.Request request) {
        List<Chat> messages = chatService.getAllMessages();
        JsonNode jsonNode = Json.toJson(messages);
        return ok(jsonNode).as("application/json");

    }
    @With(AuthenticatedAction.class)
    public Result send(Http.Request request) {
        String username = request.attrs().get(Security.USERNAME);
        People user = userService.getUserByUsername(username);
        Chat chat = new Chat();
        chat.setUser(user);
        chat.setMessage(request.body().asJson().get("message").asText());
        chatService.saveMessage(chat);
        return ok(Json.toJson(chat)).as("application/json");
    }

    @With(AuthenticatedAction.class)
    public Result update(Http.Request request) {
        String id = request.body().asJson().get("id").asText();
        String message = request.body().asJson().get("message").asText();
        Chat chat = chatService.getMessageById(Long.valueOf(id));
        chat.setMessage(message);
        chatService.updateMessage(chat);
        return ok(Json.toJson(chat)).as("application/json");
    }

    @With(AuthenticatedAction.class)
    public Result destroy(Http.Request request) {
        String id = request.body().asJson().get("id").asText();
        Chat chat = chatService.getMessageById(Long.valueOf(id));
        chatService.deleteMessage(chat);
        return ok();
    }

    @With(AuthenticatedAction.class)
    public Result userMessages(Http.Request request) {
        String username = request.attrs().get(Security.USERNAME);
        People user = userService.getUserByUsername(username);
        List<Chat> userMessages = chatService.getMessagesByUser(user);
        JsonNode jsonNode = Json.toJson(userMessages);
        return ok(jsonNode).as("application/json");
    }
}