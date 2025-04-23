// loadCourses.js

// This function will populate the course dropdown
function loadCourses() {
    const courseSelect = document.getElementById('courseTitle'); // Ensure 'courseTitle' is the correct id of the dropdown

    // Fetch course data from your API
    fetch('https://an918u267j.execute-api.us-east-1.amazonaws.com/prod/coursesretrieval')  // Replace with your actual API URL
        .then(response => response.json())  // Get the full response JSON
        .then(data => {
            // The response body is a string, so we need to parse it into an actual array
            const courses = JSON.parse(data.body);  // Parse the stringified JSON body

            // Loop through each course and create an option element
            courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course.CourseID;  // Set the option value as the CourseID
                option.textContent = course.CourseID;  // Set the display text as the CourseID
                courseSelect.appendChild(option);  // Append the option to the dropdown
            });
        })
        .catch(error => {
            console.error('Error fetching courses:', error);
            alert('Failed to load course data.');
        });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', loadCourses);
