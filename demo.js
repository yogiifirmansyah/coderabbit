// function to calculate the area of a circle
function calculateCircleArea(radius) {
    if (radius < 0) {
        throw new Error("Radius cannot be negative");
    }
    return Math.PI * radius * radius;
}

// function to fetch Users API from Server
async function fetchUsersApi() {
    // Implementation for fetching Users API from server
    try {
        const response = await fetch('https://api.example.com/users');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching Users API:", error);
        throw error;
    } finally {
        console.log("Fetch Users API operation completed.");
    }
}