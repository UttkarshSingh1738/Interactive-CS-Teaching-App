package models;

import io.ebean.Finder;
import io.ebean.Model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import io.ebean.annotation.WhenCreated;
import io.ebean.annotation.WhenModified;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import play.data.validation.Constraints;
import org.mindrot.jbcrypt.BCrypt;

import java.time.Instant;

@Entity
public class People extends Model {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Long id;

    @Constraints.Required
    public String username;

    @Constraints.Required
    public String password;

    @WhenCreated
    public Instant createdTime;

    @WhenModified
    public Instant updatedTime;

    public static Finder<Long, People> find = new Finder<>(People.class);

    // Getter and setter methods
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    // Hash the password and set it
    public void setPassword(String password) {
        this.password = BCrypt.hashpw(password, BCrypt.gensalt());
    }

    // Verify the password
    public boolean checkPassword(String password) {
        return BCrypt.checkpw(password, this.password);
    }

    public Instant getCreatedTime() { return createdTime; }

    public Instant getUpdatedTime() { return updatedTime; }
}