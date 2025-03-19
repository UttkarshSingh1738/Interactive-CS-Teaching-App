package controllers;
import play.mvc.With;

import com.fasterxml.jackson.databind.JsonNode;

import com.fasterxml.jackson.databind.node.ObjectNode;

import actions.AuthenticatedAction;
import models.People;
import models.QuizAttempt;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import services.UserService;
import services.QuizService;
import services.QuizServiceImpl;
import utils.Security;

import java.time.Instant;
import java.util.List;

import javax.inject.Inject;

public class QuizController extends Controller {

    // Use the QuizService to handle business logic.
    private final QuizService quizService = new QuizServiceImpl();
    private final UserService userService;

    @Inject
    public QuizController(UserService userService) {
        this.userService = userService;
        // this.quizService = new QuizServiceImpl(); // Or inject this as well if preferred.
    }

    /**
     * GET /quiz/question
     * Returns a generated quiz question.
     */
    @With(AuthenticatedAction.class)
    public Result getQuestion(Http.Request request) {
        QuizService.Question question = quizService.generateQuestion();
        return ok(Json.toJson(question));
    }

    /**
     * POST /quiz/attempt
     * Expects JSON with quizType, question, userAnswer, correctAnswer, and duration.
     * Evaluates the answer, stores the attempt, and returns the result.
     */
    @With(AuthenticatedAction.class)
    public Result submitAttempt(Http.Request request) {
        JsonNode json = request.body().asJson();
        if (json == null) {
            return badRequest("Expecting JSON data");
        }

        String quizType = json.findPath("quizType").asText();
        String questionText = json.findPath("question").asText();
        String userAnswer = json.findPath("userAnswer").asText();
        String correctAnswer = json.findPath("correctAnswer").asText();
        int duration = json.findPath("duration").asInt();

        boolean isCorrect = userAnswer.equals(correctAnswer);

        // Retrieve the currently authenticated user.
        People user = getCurrentUser(request);
        if (user == null) {
            return unauthorized("User not authenticated");
        }

        // Create and save a new QuizAttempt record.
        QuizAttempt attempt = new QuizAttempt();
        attempt.setUser(user);
        attempt.setQuizType(quizType);
        attempt.setQuestion(questionText);
        attempt.setUserAnswer(userAnswer);
        attempt.setCorrectAnswer(correctAnswer);
        attempt.setIsCorrect(isCorrect);
        attempt.setDuration(duration);
        attempt.setAttemptTime(Instant.now());
        attempt.save();

        ObjectNode result = Json.newObject();
        result.put("isCorrect", isCorrect);
        return ok(result);
    }

    /**
     * GET /quiz/leaderboard
     * Returns a list of leaderboard entries.
     */
    @With(AuthenticatedAction.class)
    public Result getLeaderboard(Http.Request request) {
        List<QuizService.LeaderboardEntry> leaderboard = quizService.getLeaderboard();
        return ok(Json.toJson(leaderboard));
    }

    /**
     * GET /quiz/stats
     * Returns personal statistics for the current user.
     */
    @With(AuthenticatedAction.class)
    public Result getUserStats(Http.Request request) {
        People user = getCurrentUser(request);
        if (user == null) {
            return unauthorized("User not authenticated");
        }
        QuizService.UserStats stats = quizService.getUserStats(user);
        return ok(Json.toJson(stats));
    }

    /**
     * Dummy method to retrieve the current authenticated user.
     * Replace with your actual authentication logic.
     */
    @With(AuthenticatedAction.class)
    private People getCurrentUser(Http.Request request) {
        String username = request.attrs().get(Security.USERNAME);

        return userService.getUserByUsername(username);
    }    
}