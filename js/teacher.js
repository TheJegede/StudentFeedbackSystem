window.onload = async function () {
  var email = localStorage.getItem("teacherEmail");

  if (email) {
    console.log(`Teacher email on fetch courses: ${email}`);
    await fetchCoursesForEmail(email);
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
};
