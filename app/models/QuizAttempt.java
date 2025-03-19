package models;

import io.ebean.Finder;
import io.ebean.Model;
import io.ebean.annotation.WhenCreated;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import play.data.validation.Constraints;

import java.time.Instant;

@Entity
public class QuizAttempt extends Model {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Long id;

    @ManyToOne
    public People user;

    @Constraints.Required
    public String quizType; // e.g., "binary-addition" or "logic-gates"

    @Constraints.Required
    public String question; // A text representation of the question

    public String userAnswer; // The answer provided by the user

    @Constraints.Required
    public String correctAnswer; // The correct answer for the question

    public Boolean isCorrect; // Whether the user's answer was correct

    @WhenCreated
    public Instant attemptTime; // When the attempt was made

    // Duration in seconds (or milliseconds if you prefer)
    public Integer duration;

    public static final Finder<Long, QuizAttempt> find = new Finder<>(QuizAttempt.class);

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public People getUser() {
        return user;
    }

    public void setUser(People user) {
        this.user = user;
    }

    public String getQuizType() {
        return quizType;
    }

    public void setQuizType(String quizType) {
        this.quizType = quizType;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getUserAnswer() {
        return userAnswer;
    }

    public void setUserAnswer(String userAnswer) {
        this.userAnswer = userAnswer;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public Instant getAttemptTime() {
        return attemptTime;
    }

    public void setAttemptTime(Instant attemptTime) {
        this.attemptTime = attemptTime;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }
}