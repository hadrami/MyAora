// Function to convert Firestore timestamp to readable date
export const convertTimestampToDate = (timestamp) => {
  if (!timestamp?._seconds) return null; // Handle edge cases where timestamp may not be present
  const milliseconds = timestamp._seconds * 1000; // Convert seconds to milliseconds
  const dateObject = new Date(milliseconds); // Create a Date object

  // Format the date to a readable string (you can customize the format)
  return dateObject.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
