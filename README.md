
Built by https://www.blackbox.ai

---

```markdown
# Antidote - Your Productivity Companion

Antidote is a web-based productivity application designed to help users overcome procrastination and boost their focus with various tools and features such as a Pomodoro timer, distraction blocking, challenges, and goal tracking.

## Project Overview

Antidote provides essential features for improving productivity through a user-friendly interface. The main tools include a Pomodoro timer for managing work sessions, a focus mode to minimize distractions, and rewards systems to motivate users in maintaining their productivity streaks. It also incorporates challenges for social engagement and SMART goals to help users define and achieve their objectives effectively.

## Installation

To run Antidote locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/antidote.git
   ```
2. Navigate to the project directory:
   ```bash
   cd antidote
   ```
3. Open the `index.html` file in your preferred web browser.

No server setup is required, and the application can be run directly from your local file system.

## Usage

Antidote's interface features the following key sections:

- **Timer**: Start the Pomodoro timer to manage work sessions.
- **Focus Mode**: Block distractions and create a conducive working environment.
- **Challenges**: Engage in focus challenges with friends to enhance motivation.
- **Streak Tracking**: View and maintain your daily focus streak.
- **Goal Setting**: Define and track SMART goals.

### Accessing Features

Navigate through the application using the top navigation bar. Click on each section to access its features.

## Features

- **Pomodoro Timer**: Work for 25 minutes followed by 5-minute breaks, designed to enhance focus.
- **Focus Mode**: A feature that blocks distracting websites and apps.
- **Rewards System**: Earn rewards for completing sessions and staying on track.
- **Focus Streaks**: Track days consecutively focused and maintain motivation.
- **Challenges**: Compete with friends and others to complete productivity challenges together.
- **SMART Goals**: Set specific, measurable, achievable, relevant, and time-bound goals.

## Dependencies

Antidote uses the following dependencies as defined in the `index.html` and other HTML files:

- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for rapid UI development.
- [Font Awesome](https://fontawesome.com/): A library of icons and social logos.
- Google Fonts: **Poppins** and **Inter** font families for a clean and modern typography.

```json
{
  "dependencies": {
    "tailwindcss": "^1.0.0",
    "font-awesome": "^6.0.0"
  }
}
```

## Project Structure

The project's structure is organized as follows:

```
/antidote
│
├── index.html          # Home page of the application
├── timer.html          # Pomodoro timer page
├── challenges.html     # Focus challenges page
├── streak.html         # Focus streak tracking page
├── goals.html          # SMART goals setting page
│
├── js/
│   ├── services.js     # Common services and functionalities
│   ├── timer.js        # Timer functionality
│   ├── challenges.js    # Challenge features implementation
│   └── goals.js        # Goal features implementation
│
└── css/                # Folder for any custom CSS 
```

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests to improve the functionality or aesthetics of Antidote.

## License

This project is open-source and available under the [MIT License](LICENSE).
```