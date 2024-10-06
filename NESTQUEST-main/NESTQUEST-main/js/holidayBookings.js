
// fetch-Json
let main = document.getElementById('main');

function generateHolidayBookingsHTML(holidayBookings) {
    let tag = '';

    holidayBookings.forEach(booking => {
        let { country, photo, hotelName, price } = booking;

        tag += `
            <div class="col-lg-4">
                <div class="single-destinations">
                    <div class="thumb">
                        <img src="${photo}" alt="${hotelName}">
                    </div>
                    <div class="details">
                        <h4>${hotelName}</h4>
                        <p>${country}</p>
                        <ul class="package-list">
                            <li class="d-flex justify-content-between align-items-center">
                                <span>Price per person</span>
                              <a href="#" class="price-btn" onclick="openBookingForm('${country}', '${price}')">${price}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    });

    main.innerHTML += tag;
}
           //click-function-event
function fetchHolidayBookings() {
    fetch('json/holidayBookings.json')  
        .then(response => response.json())
        .then(data => {
            generateHolidayBookingsHTML(data.holidayBookings);
        })
        .catch(error => console.error('Error fetching holiday bookings:', error));
}

document.addEventListener('DOMContentLoaded', fetchHolidayBookings);









