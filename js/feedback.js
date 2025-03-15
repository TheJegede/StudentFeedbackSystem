document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("feedbackForm");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        const enumber = document.getElementById("enumber").value.trim();
        const major = document.getElementById("major").value.trim();
        const year = document.getElementById("year").value;
        const course = document.getElementById("courseTitle").value.trim();
        const feedback = document.getElementById("feedback").value.trim();

        if (!enumber || !major || !year || !course || !feedback) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            // Get Cognito authentication token
            const authToken = await WildRydes.authToken;
            if (!authToken) {
                alert("Authentication failed. Please log in again.");
                return;
            }
console.log(authToken);
            // Define API Gateway URL (Replace with your actual API endpoint)
            // const apiUrl = "https://an918u267j.execute-api.us-east-1.amazonaws.com/dev";
            const apiUrl = _config.api.invokeUrl + '/StudentFeedback';
console.log(apiUrl);
            // Prepare request payload
            const requestBody = {
                enumber: enumber,
                major: major,
                year: year,
                course: course,
                feedback: feedback,
                timestamp: new Date().toISOString(),
            };

            // Send request to API Gateway
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`, // Include authentication token
                },
                body: JSON.stringify(requestBody),
            });

            const responseData = await response.json();
            if (response.ok) {
                alert("Feedback submitted successfully!");
                form.reset();
            } else {
                alert(`Error: ${responseData.message}`);
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Something went wrong. Please try again.");
        }
    });
});
