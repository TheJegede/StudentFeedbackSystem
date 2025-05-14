# 🧠 Anonymous Student Feedback Analysis Platform

A serverless, AI-powered platform that enables students to submit course feedback anonymously and allows faculty to view summarized insights and sentiment analysis in real-time.

## 📘 Project Overview

This capstone project was developed as part of the MS in Computer Science program at East Tennessee State University. The goal was to enhance student engagement by encouraging honest feedback and leveraging AI for meaningful analysis—all while ensuring cost-effectiveness using AWS serverless infrastructure.

## 🛠️ Features

- 🔐 **Anonymous Feedback Submission**: Students submit feedback securely, with no personal identifiers stored.
- 📊 **Real-Time Sentiment Analysis**: AWS Comprehend detects sentiment (Positive, Neutral, Negative, Mixed).
- 📝 **AI-Powered Summarization**: Amazon SageMaker generates concise summaries of student feedback.
- 📈 **Faculty Dashboard**: Professors view visual sentiment breakdowns and summarized comments.
- 💰 **Free Tier Friendly**: Designed to operate within AWS Free Tier limits for cost efficiency.

## 🚀 Technologies Used

- **Frontend**: HTML/CSS/JavaScript (Hosted on AWS Amplify)
- **Authentication**: Amazon Cognito
- **API Management**: Amazon API Gateway
- **Backend Logic**: AWS Lambda (Python)
- **Database**: Amazon DynamoDB
- **Sentiment Analysis**: AWS Comprehend
- **Summarization**: Amazon SageMaker
- **Infrastructure**: 100% Serverless (No EC2 or VPC)

## 📦 Folder Structure

```
/frontend                # HTML, JS, CSS files for the student and teacher dashboards
/backend/lambda          # Python Lambda functions (submitFeedback, getSummary, etc.)
/models/sagemaker        # Summarization model code or deployment script
/resources               # Architecture diagrams, documentation, sample data
```

## 💻 Getting Started

### Prerequisites
- AWS account with Cognito, Lambda, API Gateway, DynamoDB, and SageMaker configured
- Python 3.8+ installed
- AWS CLI configured

### Steps to Deploy
1. Clone this repository
2. Set up Cognito User Pool and Identity Pool
3. Deploy Lambda functions and link them to API Gateway endpoints
4. Create DynamoDB tables (`StudentFeedback`, `SummaryTable`)
5. Deploy frontend using AWS Amplify
6. Configure SageMaker and Comprehend access in Lambda functions

## 🧪 Sample Test

Submit a POST request to your API Gateway endpoint:
```json
{
  "enumber": "1234",
  "major": "AI & ML",
  "year": "2",
  "course_title": "Machine Learning",
  "feedback": "The course was engaging, but I would suggest more hands-on projects."
}
```

## 📷 Screenshots

![Student Submission](resources/screenshots/student_form.png)
![Teacher Dashboard](resources/screenshots/teacher_dashboard.png)

## 📈 Future Improvements

- Add feedback topic modeling for deeper insights.
- Implement asynchronous processing queues (e.g., SQS) for scale.
- Enable admin analytics and CSV export options.
- Improve UI/UX for accessibility.

## 👥 Team Members

- **Taiwo Jegede** – AI/NLP Integration, Backend Architecture
- **Adesola Ogunnubi** – Data Handling, Documentation
- **Timilehin Akano** – Project Management, AWS Backend

## 🙏 Acknowledgments

Special thanks to **Dr. Roach** for supervising and guiding this project through every stage.

## 📄 License

This project is for academic and demonstration purposes only.
