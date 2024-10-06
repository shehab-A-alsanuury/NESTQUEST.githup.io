// دالة لفتح نموذج الحجز
function openBookingForm(destination, price) {
    const form = document.getElementById('bookingForm'); // call bookingForm
    form.style.display = 'flex'; // change hidden form to be show
    document.body.classList.add('no-scroll'); // user cant scroll 

    // fill the data destination
    document.getElementById('flightDestination').value = destination;

    // parse 
    const numericPrice = parseFloat(price.replace('$', '')); // remove $ then convert to number
    document.getElementById('flightPrice').value = numericPrice; // fill Price
}

// close the form 
function closeBookingForm() {
    const form = document.getElementById('bookingForm'); // call bookingForm
    form.style.display = 'none'; // hide the form
    document.body.classList.remove('no-scroll'); // you can scroll now (user)
}

//  وحفظ البيانات في الخادم
async function handleBookingSubmit(event) {
    event.preventDefault(); //عدم تحميل الصفحة بعد الارسال

    // check price
    const pricePerDayInput = document.getElementById('flightPrice').value; // الحصول على قيمة سعر الرحلة
    const pricePerDay = parseFloat(pricePerDayInput); // تحويل السعر من نص إلى رقم

    // check days
    const numberOfDaysInput = document.getElementById('numberOfDays').value; // الحصول على عدد الأيام
    const numberOfDays = parseInt(numberOfDaysInput); // تحويل عدد الأيام من نص إلى عدد صحيح

    // التحقق مما إذا كان السعر اليومي أو عدد الأيام غير صالح
    if (isNaN(pricePerDay) || isNaN(numberOfDays) || numberOfDays <= 0) {
        alert('Please enter valid price and number of days.'); // إظهار رسالة خطأ إذا كانت المدخلات غير صحيحة
        return; //   out 
    }

    // cal. the price
    const totalPrice = (pricePerDay * numberOfDays).toFixed(2); 

    // ربط بيانات النموذج بالهيكل المستخدم في ملف JSON
    const bookingData = {
        id: Date.now().toString(36).substr(2, 5),
        country: document.getElementById('flightDestination').value, 
        price: totalPrice, // save totall salary
        hotelName: document.getElementById('fullName').value, //  call hotel holiday name 
        photo: `img/holeday/${document.getElementById('flightDestination').value.toLowerCase().replace(/\s/g, '-')}.jpg` // بناء مسار الصورة ديناميكيًا بناءً على الوجهة
    };

    try {
        // جلب الحجوزات الحالية من الخادم
        const response = await fetch('http://localhost:3001/booking'); // إرسال طلب لجلب الحجوزات الحالية
        const existingBookings = await response.json(); // تحويل استجابة الخادم إلى كائن JSON

        // التحقق مما إذا كان هناك حجز بنفس الوجهة واسم الفندق
        const conflict = existingBookings.some(booking => 
            booking.country === bookingData.country && // التحقق من تطابق الوجهة
            booking.hotelName === bookingData.hotelName // التحقق من تطابق اسم الفندق
        );

        // إذا كان هناك تعارض، إظهار رسالة خطأ
        if (conflict) {
            alert(`A booking already exists for ${bookingData.hotelName} in ${bookingData.country}.`); // إظهار رسالة تنبيه
            return; // الخروج من الدالة
        }

        // إذا لم يكن هناك تعارض، متابعة حفظ بيانات الحجز
        const saveResponse = await fetch('http://localhost:3001/booking', {
            method: 'POST', //post call 
            headers: {
                'Content-Type': 'application/json' // تحديد نوع المحتوى كـ JSON
            },
            body: JSON.stringify(bookingData) // تحويل بيانات الحجز إلى سلسلة نصية بصيغة JSON
        });

        // التحقق من نجاح عملية الحفظ
        if (!saveResponse.ok) {
            throw new Error('Failed to save booking data.'); // إلقاء خطأ إذا فشلت عملية الحفظ
        }

        // تأكيد الحجز وإغلاق النموذج
        alert(`Booking confirmed for ${bookingData.country} at $${totalPrice}!`); // إظهار رسالة تأكيد
        closeBookingForm(); // إغلاق نموذج الحجز
    } catch (error) {
        alert(`Error: ${error.message}`); // إظهار رسالة خطأ في حالة حدوث خطأ
    }
}

// تهيئة ظهور النموذج وإضافة مستمعين للأحداث عندما يتم تحميل DOM بالكامل
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bookingForm'); // الحصول على عنصر النموذج
    form.style.display = 'none'; // إخفاء النموذج عند تحميل الصفحة

    const bookingDetailsForm = document.getElementById('bookingDetailsForm'); // الحصول على نموذج تفاصيل الحجز
    bookingDetailsForm.addEventListener('submit', handleBookingSubmit); // إضافة مستمع حدث لمعالجة إرسال النموذج

    const closeBtn = document.querySelector('.close-btn'); // الحصول على زر الإغلاق
    closeBtn.addEventListener('click', closeBookingForm); // إضافة مستمع حدث لإغلاق النموذج عند الضغط على زر الإغلاق
});
