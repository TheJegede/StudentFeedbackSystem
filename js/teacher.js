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

      const courseList = document.getElementById("courseList");
      courseList.innerHTML = "";

      courses.forEach((course) => {
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
      });
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

      const rawData = await response.json(); // body is a stringified JSON
      const data = JSON.parse(rawData.body);

      // Clear out any dummy content
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
};
