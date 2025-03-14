document.addEventListener("DOMContentLoaded", function () {
    const feedbackForm = document.getElementById("feedbackForm");

    feedbackForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Capture form values
        const eNumber = document.getElementById("eNumber").value;
        const major = document.getElementById("major").value;
        const year = document.getElementById("year").value;
        const courseTitle = document.getElementById("courseTitle").value;
        const feedback = document.getElementById("feedback").value;

        // Construct request payload
        const requestData = {
            eNumber: eNumber,
            major: major,
            year: year,
            course: courseTitle,
            feedback: feedback,
            timestamp: new Date().toISOString() // Add timestamp
        };

        try {
            // Send POST request to API Gateway
            const response = await fetch("https://eweqwr1ieh.execute-api.us-east-1.amazonaws.com/dev/submit-feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            // Parse the response
            const responseData = await response.json();
            
            if (response.ok) {
                alert("✅ Feedback submitted successfully!");
                feedbackForm.reset(); // Clear form after successful submission
            } else {
                alert("❌ Error submitting feedback: " + responseData.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("⚠️ Failed to submit feedback. Please try again.");
        }
    });
});
