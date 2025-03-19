package services;

import models.People;

import java.util.List;
import java.util.Map;

public interface QuizService {

    // Data transfer object for a quiz question.
    class Question {
        public String quizType;
        public String questionText;
        public String correctAnswer;

        public Question(String quizType, String questionText, String correctAnswer) {
            this.quizType = quizType;
            this.questionText = questionText;
            this.correctAnswer = correctAnswer;
        }
    }

    // Data transfer object for a leaderboard entry.
    class LeaderboardEntry {
        public String username;
        public int score;

        public LeaderboardEntry(String username, int score) {
            this.username = username;
            this.score = score;
        }
    }

    class QuizTypeStats {
        public int attempts;
        public int correct;
        public double accuracy;
        
        public QuizTypeStats(int attempts, int correct) {
            this.attempts = attempts;
            this.correct = correct;
            this.accuracy = attempts > 0 ? ((double) correct / attempts) * 100 : 0;
        }
    }
    
    class TimelineData {
        public String date; // format YYYY-MM-DD
        public int attempts;
        public int correct;
        
        public TimelineData(String date, int attempts, int correct) {
            this.date = date;
            this.attempts = attempts;
            this.correct = correct;
        }
    }
    
    // Data transfer object for user statistics.
    class UserStats {
        public String username;
        public int totalAttempts;
        public int correctAttempts;
        public double averageDuration;
        public double accuracyPercentage;
        public Map<String, QuizTypeStats> breakdownByType;
        public List<TimelineData> timeline; // e.g., daily aggregates

        public UserStats(String username, int totalAttempts, int correctAttempts, double averageDuration, double accuracyPercentage, Map<String, QuizTypeStats> breakdownByType, List<TimelineData> timeline) {
            this.username = username;
            this.totalAttempts = totalAttempts;
            this.correctAttempts = correctAttempts;
            this.averageDuration = averageDuration;
            this.accuracyPercentage = accuracyPercentage;
            this.breakdownByType = breakdownByType;
            this.timeline = timeline;
        }
    }

    // Generate a new quiz question.
    Question generateQuestion();

    // Retrieve leaderboard data.
    List<LeaderboardEntry> getLeaderboard();

    // Retrieve statistics for a specific user.
    UserStats getUserStats(People user);
}
