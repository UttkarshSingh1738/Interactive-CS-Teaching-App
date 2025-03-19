package services;

import models.People;
import models.QuizAttempt;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

public class QuizServiceImpl implements QuizService {

    private static final Random random = new Random();

    @Override
public Question generateQuestion() {
    // Randomly pick a quiz type.
    int type = random.nextInt(2); // 0 for binary addition, 1 for logic gate
    if (type == 0) {
        // Binary addition
        int a = random.nextInt(16); // 0-15
        int b = random.nextInt(16);
        String binaryA = Integer.toBinaryString(a);
        String binaryB = Integer.toBinaryString(b);
        int sum = a + b;
        String binarySum = Integer.toBinaryString(sum);
        String questionText = binaryA + " + " + binaryB + " = ?";
        return new Question("binary-addition", questionText, binarySum);
    } else {
        // Logic gate problem, e.g., using AND or OR.
        // Generate two binary digits (0 or 1).
        int a = random.nextInt(2);
        int b = random.nextInt(2);
        // Randomly choose a gate.
        String[] gates = {"AND", "OR", "XOR"};
        String gate = gates[random.nextInt(gates.length)];
        String questionText = a + " " + gate + " " + b + " = ?";
        String correctAnswer;
        switch (gate) {
            case "AND":
                correctAnswer = String.valueOf(a & b);
                break;
            case "OR":
                correctAnswer = String.valueOf(a | b);
                break;
            case "XOR":
                correctAnswer = String.valueOf(a ^ b);
                break;
            default:
                correctAnswer = "";
        }
        return new Question("logic-gate", questionText, correctAnswer);
    }
}

@Override
public List<LeaderboardEntry> getLeaderboard() {
    // Retrieve all quiz attempts
    List<QuizAttempt> attempts = QuizAttempt.find.query().findList();
    // Map: username -> [correctAttempts, totalAttempts]
    Map<String, int[]> userStats = new HashMap<>();
    
    for (QuizAttempt attempt : attempts) {
        String username = attempt.getUser().getUsername();
        int[] stats = userStats.getOrDefault(username, new int[]{0, 0});
        stats[1]++; // increment total attempts
        if (attempt.getIsCorrect() != null && attempt.getIsCorrect()) {
            stats[0]++; // increment correct attempts
        }
        userStats.put(username, stats);
    }
    
    List<LeaderboardEntry> leaderboard = new ArrayList<>();
    for (Map.Entry<String, int[]> entry : userStats.entrySet()) {
        String username = entry.getKey();
        int correct = entry.getValue()[0];
        int total = entry.getValue()[1];
        double accuracy = total > 0 ? ((double) correct / total) * 100 : 0;
        leaderboard.add(new LeaderboardEntry(username, (int) accuracy)); // you could store as double if preferred
    }
    
    // Sort descending by accuracy
    leaderboard.sort((e1, e2) -> Double.compare(e2.score, e1.score));
    return leaderboard;
    }

    @Override
    public UserStats getUserStats(People user) {
        List<QuizAttempt> attempts = QuizAttempt.find.query().where().eq("user", user).findList();
        int totalAttempts = attempts.size();
        int correctAttempts = 0;
        int totalDuration = 0;
        
        // For breakdown by quiz type
        Map<String, int[]> breakdown = new HashMap<>();
        // For timeline, group by date (assuming QuizAttempt has a getAttemptTime() returning an Instant)
        Map<String, int[]> timeline = new HashMap<>();
        
        for (QuizAttempt attempt : attempts) {
            if (attempt.getIsCorrect() != null && attempt.getIsCorrect()) {
                correctAttempts++;
            }
            if (attempt.getDuration() != null) {
                totalDuration += attempt.getDuration();
            }
            
            // Breakdown by quiz type
            String quizType = attempt.getQuizType(); // make sure QuizAttempt stores quizType
            int[] stats = breakdown.getOrDefault(quizType, new int[]{0, 0});
            stats[0]++; // total for this quiz type
            if (attempt.getIsCorrect() != null && attempt.getIsCorrect()) {
                stats[1]++; // correct for this quiz type
            }
            breakdown.put(quizType, stats);
            
            // Timeline grouping by day
            // Format the attempt time (you can use java.time.LocalDate)
            String date = attempt.getAttemptTime().toString().substring(0, 10); // simple YYYY-MM-DD
            int[] dayStats = timeline.getOrDefault(date, new int[]{0, 0});
            dayStats[0]++;
            if (attempt.getIsCorrect() != null && attempt.getIsCorrect()) {
                dayStats[1]++;
            }
            timeline.put(date, dayStats);
        }
        
        double averageDuration = totalAttempts > 0 ? ((double) totalDuration) / totalAttempts : 0.0;
        double accuracyPercentage = totalAttempts > 0 ? ((double) correctAttempts / totalAttempts) * 100 : 0.0;
        
        // Build breakdown DTO
        Map<String, QuizTypeStats> breakdownByType = new HashMap<>();
        for (Map.Entry<String, int[]> entry : breakdown.entrySet()) {
            String type = entry.getKey();
            int[] stats = entry.getValue();
            breakdownByType.put(type, new QuizTypeStats(stats[0], stats[1]));
        }
        
        // Build timeline data list
        List<TimelineData> timelineData = new ArrayList<>();
        for (Map.Entry<String, int[]> entry : timeline.entrySet()) {
            timelineData.add(new TimelineData(entry.getKey(), entry.getValue()[0], entry.getValue()[1]));
        }
        
        // Optionally sort timelineData by date
        timelineData.sort((d1, d2) -> d1.date.compareTo(d2.date));
        
        return new UserStats(user.getUsername(), totalAttempts, correctAttempts, averageDuration, accuracyPercentage, breakdownByType, timelineData);
    }
}
