document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const currentDate = today.toISOString().split("T")[0]; // Format the current date as yyyy-mm-dd
    const currentTime = today.toTimeString().slice(0, 5); // Get the current time in HH:mm format
  
    // Set the minimum date for booking (current date or later)
    const bookingDateInput = document.getElementById("bookingDate");
    bookingDateInput.setAttribute("min", currentDate);
  
    // Set the minimum time for booking if the user selects today
    const bookingTimeInput = document.getElementById("bookingTime");
    bookingDateInput.addEventListener("change", function () {
      if (this.value === currentDate) {
        bookingTimeInput.setAttribute("min", currentTime);
      } else {
        bookingTimeInput.removeAttribute("min");
      }
    });
  
    fetch("json/flights.json")
      .then((response) => response.json())
      .then((data) => {
        const cheapPackages = document.getElementById("cheap-packages");
        const luxuryPackages = document.getElementById("luxury-packages");
        const campingPackages = document.getElementById("camping-packages");
  
        data.flights.forEach((flight) => {
          const listItem = `
            <li class="d-flex justify-content-between align-items-center">
                <span>${flight.destination}</span>
                <a href="#" class="price-btn" data-id="${flight.id}" data-destination="${flight.destination}" data-price="${flight.price}">$${flight.price}</a>
            </li>
          `;
  
          if (flight.type === "Cheap Packages") {
            cheapPackages.innerHTML += listItem;
          } else if (flight.type === "Luxury Packages") {
            luxuryPackages.innerHTML += listItem;
          } else if (flight.type === "Camping Packages") {
            campingPackages.innerHTML += listItem;
          }
        });
  
        // Add click event listener to all booking buttons
        document.querySelectorAll(".price-btn").forEach((button) => {
          button.addEventListener("click", function (e) {
            e.preventDefault(); // Prevent the default anchor behavior
  
            // Gather flight data from data attributes
            const flightId = this.getAttribute("data-id");
            const flightDestination = this.getAttribute("data-destination");
            const flightPrice = this.getAttribute("data-price");
  
            // Open the booking form and fill in the hidden fields
            openBookingForm(flightId, flightDestination, flightPrice);
          });
        });
  
        // Function to validate full name
        function validateFullName() {
          const fullName = document.getElementById("fullName").value.trim();
          const namePattern = /^[A-Za-z\s]+$/;
          if (!namePattern.test(fullName)) {
            alert("Please enter a valid full name (letters and spaces only).");
            return false;
          }
          return true;
        }
  
        // Function to validate email
        function validateEmail() {
          const email = document.getElementById("email").value.trim();
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return false;
          }
          return true;
        }
  
        // Function to validate credit card
        function validateCreditCard() {
          const creditCard = document.getElementById("creditCard").value.trim();
          if (creditCard.length !== 16 || isNaN(creditCard)) {
            alert("Credit card number must be exactly 16 digits.");
            return false;
          }
          return true;
        }
  
        // Function to validate expiration date
        function validateExpDate() {
          const expDate = document.getElementById("expDate").value.trim();
          const currentDate = new Date();
          const [expMonth, expYear] = expDate.split("/").map(Number);
          const expiryDate = new Date(`20${expYear}`, expMonth - 1);
  
          if (!/^\d{2}\/\d{2}$/.test(expDate)) {
            alert("Expiration date must be in MM/YY format.");
            return false;
          } else if (expiryDate <= currentDate) {
            alert("Expiration date is invalid or expired.");
            return false;
          }
          return true;
        }
  
        // Function to validate CVC
        function validateCVC() {
          const cvc = document.getElementById("cvc").value.trim();
          if (cvc.length !== 3 || isNaN(cvc)) {
            alert("CVC must be exactly 3 digits.");
            return false;
          }
          return true;
        }
  
        // Function to validate booking date
        function validateBookingDate() {
          const bookingDate = document.getElementById("bookingDate").value;
          const currentDate = new Date().setHours(0, 0, 0, 0);
          const selectedBookingDate = new Date(bookingDate).setHours(0, 0, 0, 0);
  
          if (selectedBookingDate < currentDate) {
            alert("Booking date cannot be in the past.");
            return false;
          }
          return true;
        }
  
        // Function to validate booking time
        function validateBookingTime() {
          const bookingDate = document.getElementById("bookingDate").value;
          const bookingTime = document.getElementById("bookingTime").value;
          const currentDate = new Date();
  
          if (bookingDate === currentDate.toISOString().split("T")[0]) { // Check if booking is for today
            if (bookingTime <= currentDate.toTimeString().split(" ")[0].substring(0, 5)) {
              alert("Booking time must be later than the current time.");
              return false;
            }
          }
  
          if (!bookingTime) {
            alert("Please select a valid booking time.");
            return false;
          }
          return true;
        }
  
        // Handle form submission
        document
          .getElementById("bookingDetailsForm")
          .addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission
  
            // Perform form validation
            if (!validateFullName() || !validateEmail() || !validateCreditCard() || !validateExpDate() || !validateCVC() || !validateBookingDate() || !validateBookingTime()) {
              return; // Stop form submission if any validation fails
            }
  
            const bookingData = {
              id: generateUniqueId(), // Generate a unique ID
              destination: document.getElementById("flightDestination").value,
              price: document.getElementById("flightPrice").value,
              fullName: document.getElementById("fullName").value,
              email: document.getElementById("email").value,
              creditCard: document.getElementById("creditCard").value,
              expDate: document.getElementById("expDate").value,
              cvc: document.getElementById("cvc").value,
              bookingDate: document.getElementById("bookingDate").value, // Added booking date
              bookingTime: document.getElementById("bookingTime").value, // Added booking time
            };
  
            // Send POST request to server to add the booking
            fetch("http://localhost:3002/bookings", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(bookingData),
            })
              .then((response) => response.json())
              .then((data) => {
                alert(
                  `Flight to ${bookingData.destination} has been booked for $${bookingData.price}!`
                );
                closeBookingForm(); // Close the form after successful booking
              })
              .catch((error) => {
                console.error("Error booking flight:", error);
                alert("Failed to book the flight. Please try again.");
              });
          });
      })
      .catch((error) => console.error("Error fetching flight data:", error));
  });
  
  // Function to open the booking form and fill in data
  function openBookingForm(flightId, flightDestination, flightPrice) {
    document.getElementById("flightId").value = flightId;
    document.getElementById("flightDestination").value = flightDestination;
    document.getElementById("flightPrice").value = flightPrice;
    document.getElementById("bookingForm").style.display = "flex";
  
    // Add the no-scroll class to body to stop scrolling
    document.body.classList.add("no-scroll");
  }
  
  // Function to close the booking form
  function closeBookingForm() {
    document.getElementById("bookingForm").style.display = "none";
  
    // Remove the no-scroll class from body to allow scrolling
    document.body.classList.remove("no-scroll");
  }
  
  // Function to generate a unique ID for each booking
  function generateUniqueId() {
    return Date.now().toString(); // Generate a unique ID based on the current timestamp
  }  