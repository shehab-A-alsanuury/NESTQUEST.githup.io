document.addEventListener('DOMContentLoaded', () => {
    fetch('json/flights.json')
        .then(response => response.json())
        .then(data => {
            const destinations = data["popular-destinations"];

            if (Array.isArray(destinations)) {
                const destinationContainer = document.getElementById('popular-destinations');

                // Iterate through the destinations array
                destinations.forEach((destination, index) => {
                    const destinationItem = `
                        <div class="col-lg-4">
                            <div class="single-destination relative">
                                <div class="thumb relative">
                                    <div class="overlay overlay-bg"></div>
                                    <img class="img-fluid" src="${destination.image}" alt="${destination.title}">
                                </div>
                                <div class="desc">
                                    <a href="#" class="price-btn" data-destination="${destination.title}" data-price="${destination.price}">${destination.price}</a>
                                    <h4>${destination.title}</h4>
                                    <p>${destination.location}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    destinationContainer.innerHTML += destinationItem;
                });

                // Add event listeners to each "Book Now" button
                document.querySelectorAll('.price-btn').forEach(button => {
                    button.addEventListener('click', function(e) {
                        e.preventDefault();
                        const destination = this.getAttribute('data-destination');
                        const price = this.getAttribute('data-price');
                        
                        // Call the function to open the booking form and pass in the data
                        openBookingForm(destination, price);
                    });
                });
            } else {
                console.error('Expected an array but got:', destinations);
            }
        })
        .catch(error => console.error('Error fetching destinations:', error));
});

// Function to open the booking form and prefill data
function openBookingForm(destination, price) {
    document.getElementById('flightDestination').value = destination;
    document.getElementById('flightPrice').value = price;
    document.getElementById('bookingForm').style.display = 'flex';

    // Add the no-scroll class to body to stop scrolling
    document.body.classList.add('no-scroll');
}
