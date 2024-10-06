// 1. Booked Dates Object & Fetching Booked Dates
const bookedDates = {};
fetch('http://localhost:3000/bookings')
    .then(response => response.json())
    .then(data => {
        data.forEach(booking => {
            bookedDates[booking.hotelId] = bookedDates[booking.hotelId] || [];
            bookedDates[booking.hotelId].push(booking.startDate);
        });
    });

// 2. Checking Date Availability
function isDateAvailable(hotelId, date) {
    return !bookedDates[hotelId]?.includes(date);
}

// 3. Fetching Hotels and Displaying Them
document.addEventListener('DOMContentLoaded', () => {
    fetch("https://raw.githubusercontent.com/mohammadnoorsaqer/NESTQUEST/refs/heads/main/json/hotels.json")

        .then(response => response.json())
        .then(data => {
            console.log(data); 
            const hotels = data.hotels; 
            hotels.forEach(hotel => {
                const hotelCard = `
                    <div class="col-lg-4">
                        <div class="single-destinations">
                            <div class="thumb">
                                <img src="${hotel.image}" alt="${hotel.name}">
                            </div>
                            <div class="details">
                                <h4>${hotel.name}</h4>
                                <p>Swimming Pool: ${hotel.swimming_pool}</p>
                                <p>Gymnasium: ${hotel.gymnasium}</p>
                                <p>Wi-Fi: ${hotel.wi_fi}</p>
                                <p>Room Service: ${hotel.room_service}</p>
                                <p>Air Condition: ${hotel.air_condition}</p>
                                <p>Restaurant: ${hotel.restaurant}</p>
                                <button onclick="bookHotel(${hotel.id}, '${hotel.name}', ${hotel.price_per_night})" class="btn yellow-btn m-auto d-flex">Book Now</button>
                            </div>
                        </div>
                    </div>`;
                document.getElementById('hotel-container').innerHTML += hotelCard;
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});;

// 4. Booking Management
const hotelBookings = {};

// 5. Booking Modal & Confirmation Functions
function bookHotel(hotelId, hotelName, hotelPrice) {
    const hotelDetails = `Hotel: ${hotelName}<br>Price per night: ${hotelPrice}`;
    document.getElementById('hotelDetails').innerHTML = hotelDetails;
    $('#bookingModal').modal('show');
    document.getElementById('confirmBooking').onclick = () => confirmBooking(hotelId);
}

async function confirmBooking(hotelId) {
    const startDate = document.getElementById('bookingDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const numAdults = document.getElementById('numAdults').value;
    const numChildren = document.getElementById('numChildren').value;
    const fullName = document.getElementById('fullName').value;
    const creditCard = document.getElementById('creditCard').value;
    const cvv = document.getElementById('cvv').value;


    // Validation Functions
    function isValidCreditCard(cardNumber) {
        const regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12}|2(?:22|7[0-9]|8[0-9])\d{12})$/;
        return regex.test(cardNumber);
    }
    function validateName(fullName) {
        const nameRegex = /^[A-Za-z\s]+$/; // Allows only letters and spaces
        return nameRegex.test(fullName.trim());
    }
    if (!validateName(fullName)) {
        alert('Please enter a valid name (letters and spaces only).');
        return;
    }


    function isValidCVV(cvv) {
        return /^\d{3,4}$/.test(cvv);
    }

    // Input Validations
    if (!isValidCVV(cvv)) {
        alert('CVV must be 3 or 4 digits long.');
        return;
    }

    if (!isValidCreditCard(creditCard)) {
        alert('Please enter a valid credit card number.');
        return;
    }

    if (!fullName || !creditCard || !startDate || !returnDate) {
        alert('Please fill out all required fields.');
        return;
    }

    if (startDate >= returnDate) {
        return alert('Please choose a valid date.');
    }

    // Availability Check
    if (!isDateAvailable(hotelId, startDate)) {
        alert('This Room Is Booked on this day, please choose another day');
        return;
    }
    
    // Prepare and Send Booking Data
    const bookingData = {
        hotelId, startDate, returnDate, numAdults, numChildren, fullName, creditCard, cvv
    };
    fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Booking confirmed! Enjoy your stay!');
        bookedDates[hotelId] = bookedDates[hotelId] || [];
        bookedDates[hotelId].push(startDate);
        $('#bookingModal').modal('hide');
    })
    .catch(error => console.error('Error:', error));
}
// 6. Set Minimum Date on Load
window.onload = () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').setAttribute('min', today);
    document.getElementById('returnDate').setAttribute('min', today);
}
