package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.libs.Json;
import models.People;
import play.mvc.*;
import services.UserService;
import services.TokenService;

import javax.inject.Inject;

public class HomeController extends Controller {

    private final UserService userService;

    @Inject
    public HomeController(UserService userService) {
        this.userService = userService;
    }

    public Result index() {
        return ok();
    }

    public Result register() {
        return ok();
    }

    public Result save(Http.Request request) {
        People user = Json.fromJson(request.body().asJson(), People.class);
        userService.saveUser(user);
        return ok();
    }

    public Result authenticate(Http.Request request) {
        JsonNode json = request.body().asJson();
        String username = json.get("username").asText();
        String password = json.get("password").asText();
        People user = userService.authenticateUser(username, password);

        ObjectNode result = Json.newObject();
        if (user != null) {
            String token = TokenService.generateToken(username);
            result.put("status", "success");
            result.put("token", token);
        } else {
            result.put("status", "fail");
        }
        return ok(result).as("application/json");
    }

    public Result logout(Http.Request request) {
        return ok();
    }
}