/* global WildRydes _config */

document.addEventListener("DOMContentLoaded", function () {
    console.log("Feedback.js loaded");

    // Attach event listener to the feedback form
    const feedbackForm = document.getElementById("feedbackForm");
    if (feedbackForm) {
        feedbackForm.addEventListener("submit", submitFeedback);
    } else {
        console.error("Feedback form not found!");
    }
});

async function submitFeedback(event) {
    event.preventDefault(); // Prevent page reload

    try {
        // 🔥 Get Cognito token from WildRydes.authToken
        const token = await WildRydes.authToken;
        console.log("Token being sent:", token);  // Debugging step

        // Collect feedback form data
        const feedbackData = {
            eNumber: document.getElementById("eNumber").value,
            major: document.getElementById("major").value,
            year: document.getElementById("year").value,
            course: document.getElementById("courseTitle").value,
            feedback: document.getElementById("feedback").value,
            timestamp: new Date().toISOString()
        };

        // Ensure required fields are filled
        if (!feedbackData.eNumber || !feedbackData.feedback) {
            alert("Please fill in all required fields.");
            return;
        }

        // Make API request
        const response = await fetch(`${window._config.api.invokeUrl}/student`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token  // Attach JWT Token from Cognito
            },
            body: JSON.stringify(feedbackData)
        });

        if (!response.ok) {
            throw new Error(`Failed to submit feedback: ${response.statusText}`);
        }

        // Handle success response
        const responseData = await response.json();
        alert("Feedback submitted successfully!");
        console.log("Success:", responseData);

        // Optional: Clear form after submission
        document.getElementById("feedbackForm").reset();

    } catch (error) {
        console.error("Error:", error);
        alert("Failed to submit feedback. Ensure you are logged in.");
    }
}
