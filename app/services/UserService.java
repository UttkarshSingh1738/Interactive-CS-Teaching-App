package services;

import models.People;
import io.ebean.Finder;

import javax.inject.Inject;
import java.util.List;

public class UserService {

    @Inject
    public UserService() {
    }

    public List<People> getAllUsers() {
        return People.find.all();
    }

    public People getUserByUsername(String username) {
        return People.find.query().where().eq("username", username).findOne();
    }

    public void saveUser(People user) {
        user.save();
    }

    public People authenticateUser(String username, String password) {
        People user = getUserByUsername(username);
        if (user != null && user.checkPassword(password)) {
            return user;
        }
        return null;
    }
}
