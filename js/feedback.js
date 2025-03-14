async function getCognitoToken() {
    return new Promise((resolve, reject) => {
        const poolData = {
            UserPoolId: window._config.cognito.userPoolId,
            ClientId: window._config.cognito.userPoolClientId
        };

        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        const cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession((err, session) => {
                if (err) {
                    console.error("Error getting session:", err);
                    reject(err);
                } else {
                    console.log("Cognito Token Retrieved");
                    resolve(session.getIdToken().getJwtToken()); // Return JWT token
                }
            });
        } else {
            reject("User not logged in");
        }
    });
}

// Function to send feedback
async function submitFeedback(event) {
    event.preventDefault(); // Prevent page reload

    const feedbackData = {
        eNumber: document.getElementById("eNumber").value,
        major: document.getElementById("major").value,
        year: document.getElementById("year").value,
        course: document.getElementById("courseTitle").value,
        feedback: document.getElementById("feedback").value,
        timestamp: new Date().toISOString()
    };

    try {
        const token = await getCognitoToken(); // 🔥 Get Cognito Token

        const response = await fetch(`${window._config.api.invokeUrl}/student`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token // Attach JWT Token
            },
            body: JSON.stringify(feedbackData)
        });

        if (!response.ok) {
            throw new Error(`Failed to submit feedback: ${response.statusText}`);
        }

        const responseData = await response.json();
        alert("Feedback submitted successfully!");
        console.log("Success:", responseData);

    } catch (error) {
        console.error("Error:", error);
        alert("Failed to submit feedback. Ensure you are logged in.");
    }
}

// Attach function to form submission
document.getElementById("feedbackForm").addEventListener("submit", submitFeedback);
