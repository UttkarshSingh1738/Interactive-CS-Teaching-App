# Interactive CS Teaching App

An interactive full-stack web application that combines a multiuser chatroom with engaging computer science quizzes. This app lets users challenge themselves with quizzes on topics like binary addition and logic gates, track their performance via a leaderboard and detailed statistics, and chat with other users in real time.

## Features

- **Interactive Quizzes:**  
  - Multiple quiz types including binary arithmetic and logic gates.  
  - Real-time feedback on quiz answers.  
  - Response time is measured from when the question is displayed to when an answer is submitted.

- **Leaderboard:**  
  - Aggregates quiz attempts and calculates accuracy percentage (correct attempts / total attempts).  
  - Ranks users by their overall quiz accuracy.

- **Statistics Dashboard:**  
  - Displays overall stats: total attempts, correct attempts, average duration, and overall accuracy.  
  - Provides a breakdown by quiz type.  
  - Shows a timeline graph of quiz attempts and correct answers per day (using a line chart).

- **Chatroom:**  
  - Multiuser real-time chat functionality.  
  - Seamless integration with the quiz feature—users can switch between quizzing and chatting.

- **User Authentication:**  
  - Secure login and registration using JWT-based authentication.  
  - Protected endpoints for quiz and chat functionalities.

## Technologies

- **Backend:**  
  - Java Play Framework  
  - MySQL (for data persistence)  
  - Ebean ORM for database operations  
  - JWT for authentication

- **Frontend:**  
  - React.js  
  - React Router for navigation  
  - Axios for API calls  
  - Bootstrap for styling  
  - react-chartjs-2 and Chart.js for data visualization

## Installation

### Prerequisites

- **Java JDK 11** (or higher)
- **Node.js** (latest LTS version)
- **MySQL** (version 8)
- **sbt** (Scala Build Tool, version 1.1+)

### Backend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/Interactive-CS-Teaching-App.git
   cd Interactive-CS-Teaching-App
   ```

2. **Configure MySQL:**

   Update the application.conf file in the conf/ directory with your MySQL credentials:

   ```conf
   db.default.driver=com.mysql.cj.jdbc.Driver
   db.default.url="jdbc:mysql://localhost:3306/yourdatabase"
   db.default.username=yourusername
   db.default.password=yourpassword
   ```

3. **Apply Evolutions:**

   Start the Play application with:

   ```bash
   sbt run
   ```

   Then, follow the prompts in your browser to apply the evolution scripts that create the required tables (people, chat, quiz_attempt).

4. **Run the Backend:**

   The backend will be available at http://localhost:9000.

### Frontend Setup

1. Navigate to the frontend directory and install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. **Run the React development server:**

   ```bash
   npm start
   ```

   The frontend will be available at http://localhost:3000.

   Make sure your package.json includes a proxy configuration to forward API calls to the backend:

   ```json
   "proxy": "http://localhost:9000"
   ```

## Usage

- **Register / Login:**

  Open the app in your browser.  
  Register a new account or log in with your credentials.  
  Successful authentication redirects you to the Quiz page.

- **Quiz:**

  The Quiz page presents interactive questions (binary addition or logic gate problems).  
  Response time is measured and recorded.  
  Immediate feedback is provided after submitting your answer.  
  Your quiz attempts are recorded for leaderboard ranking and statistics.

- **Leaderboard & Stats:**

  The Leaderboard page displays user rankings based on accuracy percentage.  
  The Stats page shows overall performance, a breakdown by quiz type, and a timeline chart visualizing daily quiz activity.

- **Chatroom:**

  The Chatroom provides real-time multiuser chat functionality.  
  Users can switch between the quiz interface and the chatroom seamlessly.

## API Endpoints

- **User Authentication:**

  - POST /api/authenticate – Authenticates a user and returns a JWT token.
  - POST /api/save – Registers a new user.

- **Chat:**

  - GET /api/chatroom – Retrieves all chat messages.
  - POST /api/chatroom/send – Sends a new chat message.
  - Additional endpoints for updating and deleting messages.

- **Quiz:**

  - GET /quiz/question – Generates a new quiz question.
  - POST /quiz/attempt – Submits a quiz attempt.
  - GET /quiz/leaderboard – Retrieves leaderboard data.
  - GET /quiz/stats – Retrieves detailed quiz statistics.

## Future Improvements

- **Additional Quiz Types:**

  Expand quizzes to include topics like data structures, algorithms, and other CS subjects.


- **Scalability & Optimization:**

  Optimize backend aggregation queries for handling large datasets efficiently.

