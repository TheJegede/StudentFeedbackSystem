window.onload = async function () {
  var email = localStorage.getItem("teacherEmail");

  if (email) {
    console.log(`Teacher email on fetch courses: ${email}`);
    await fetchCoursesForEmail(email);
    await fetchSentimentsForTeacherCourse(email);
  } else {
    console.warn("No email found in storage, maybe redirect to login?");
    window.location.href = "/index.html";
  }

  async function fetchCoursesForEmail(email) {
    const apiUrl = `https://415ey95x52.execute-api.us-east-1.amazonaws.com/prod/courses/${email}`;

    try {
      const authToken = await WildRydes.authToken;
      if (!authToken) {
        alert("Authentication failed. Please log in again.");
        window.location.href = "/index.html";
        return;
      }

      console.log("Authentication Token:", authToken);
      console.log("API URL:", apiUrl);
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error response:", responseData);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("Courses fetched:", responseData);

      const courses = JSON.parse(responseData.body);
      console.log("Parsed course array:", courses);

      const professor = courses[0]?.professor || "Professor";

      const welcomeMsg = document.querySelector(".welcome-message");
      welcomeMsg.innerHTML = `Welcome, ${professor}`;

      const courseList = document.getElementById("courseList");
      const summaryContainer = document.querySelector(".summary-container");
      const summaryText = document.getElementById("summary-text");

      courseList.innerHTML = "";
      summaryContainer.innerHTML = "";
      if (summaryText) summaryText.style.display = "none";

      for (const course of courses) {
        // Add course to course list
        const li = document.createElement("li");
        li.className = "course-item";
        li.innerHTML = `
          <div class="course-item-icon">
            <i class="fas fa-book-open"></i>
          </div>
          <div>
            <strong>${course.courseTitle}</strong>
            <p style="margin: 0; font-size: 12px; color: #666">
              ${course.courseNumber}
            </p>
          </div>
        `;
        courseList.appendChild(li);

        // Fetch and add course summary
        const summary = await fetchSummaryForCourse(course.courseTitle);

        const summaryBlock = document.createElement("div");
        summaryBlock.className = "summary-block";
        summaryBlock.innerHTML = `
          <h4 style="margin-bottom: 4px;">${course.courseTitle}</h4>
          <p style="font-size: 14px;">${summary}</p>
        `;
        summaryContainer.appendChild(summaryBlock);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }

  async function fetchSentimentsForTeacherCourse(email) {
    const apiUrl = `https://415ey95x52.execute-api.us-east-1.amazonaws.com/prod/sentiment/sentiments/?teacher=${email}`;
    const authToken = await WildRydes.authToken;
    if (!authToken) {
      alert("Authentication failed. Please log in again.");
      window.location.href = "/index.html";
      return;
    }
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch course sentiments");
      }

      const rawData = await response.json();
      const data = JSON.parse(rawData.body);

      const card = document.querySelector(".dashboard-card");
      card.innerHTML = `
        <div class="card-header">
          <h3 class="card-title">Course Sentiment</h3>
          <i class="fas fa-chart-pie" style="color: #1e3a8a"></i>
        </div>
      `;

      data.sentiments.forEach(({ course, sentiment_scores }) => {
        const positive = Math.round(sentiment_scores.Positive * 100);
        const neutral = Math.round(sentiment_scores.Neutral * 100);
        const negative = Math.round(sentiment_scores.Negative * 100);
        const mixed = Math.round(sentiment_scores.Mixed * 100);

        const sentimentBar = document.createElement("div");
        sentimentBar.style.marginTop = "15px";
        sentimentBar.innerHTML = `
          <p style="font-size: 14px; font-weight: 600; margin: 2px 0;">${course}</p>
          <div class="sentiment-bar" style="display: flex; height: 20px; width: 100%; border-radius: 10px; overflow: hidden; margin-top: 5px">
            <div style="width: ${positive}%; background-color: #4caf50;"></div>
            <div style="width: ${neutral}%; background-color: #ff9800;"></div>
            <div style="width: ${negative}%; background-color: #f44336;"></div>
            <div style="width: ${mixed}%; background-color: #c1c1c1;"></div>
          </div>
          <p style="margin: 5px 0 0; font-size: 10px; font-weight: 100;">
            <span style="color: #4caf50">Positive: ${positive}%</span> |
            <span style="color: #ff9800">Neutral: ${neutral}%</span> |
            <span style="color: #f44336">Negative: ${negative}%</span> |
            <span style="color: #c1c1c1">Mixed: ${mixed}%</span>
          </p>
        `;
        card.appendChild(sentimentBar);
      });
    } catch (error) {
      console.error("Error fetching course sentiment:", error);
      alert("Something went wrong while loading sentiments.");
    }
  }

  async function fetchSummaryForCourse(courseTitle) {
    const apiUrl =
      "https://415ey95x52.execute-api.us-east-1.amazonaws.com/prod/GettingSummaries";

    try {
      const authToken = await WildRydes.authToken;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({ course: courseTitle }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error(
          `Error fetching summary for ${courseTitle}:`,
          responseData
        );
        return "No summary available";
      }

      const summaries = JSON.parse(responseData.body);

      if (
        Array.isArray(summaries) &&
        summaries.length > 0 &&
        summaries[0].summary
      ) {
        return summaries[0].summary;
      } else {
        return "No summary available";
      }
    } catch (error) {
      console.error("Summary fetch error:", error);
      return "No summary available";
    }
  }
};
