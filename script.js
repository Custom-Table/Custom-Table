document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. برمجة أزرار التمرير (الأسهم) ---
    const wrappers = document.querySelectorAll('.carousel-wrapper');

    wrappers.forEach(wrapper => {
        const carousel = wrapper.querySelector('.products-carousel');
        const rightBtn = wrapper.querySelector('.right-btn');
        const leftBtn = wrapper.querySelector('.left-btn');

        // مقدار التمرير عند كل ضغطة
        const scrollAmount = 240; 

        // التمرير لليمين (نستخدم قيم سالبة وموجبة بناءً على اتجاه الموقع rtl)
        rightBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        // التمرير لليسار
        leftBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    });

    // --- 2. برمجة الطلب عبر الواتساب ---
    const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
    
    // قم بتغيير هذا الرقم إلى رقمك الفعلي (يجب أن يبدأ برمز الدولة بدون أصفار أو علامة +)
    // مثال للسعودية: 966500000000
    const phoneNumber = "9665XXXXXXXX"; 

    whatsappButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // جلب اسم المنتج من العنصر الأب الذي يحمل الكلاس product-card
            const productCard = e.target.closest('.product-card');
            const productName = productCard.getAttribute('data-name');
            
            // تجهيز الرسالة
            const message = `مرحباً لافوتنا، أريد الاستفسار أو الطلب بخصوص هذا المنتج: ${productName}`;
            
            // تشفير الرسالة لتناسب رابط الـ URL
            const encodedMessage = encodeURIComponent(message);
            
            // فتح تطبيق الواتساب في نافذة جديدة
            window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        });
    });

});

// --- 3. تجهيز دالة جلب البيانات من الداتابيس (سيتم تفعيلها لاحقاً) ---
async function loadProductsFromDB() {
    // هذه الدالة ستقوم بمسح المنتجات الثابتة من الـ HTML وتوليدها بناءً على البيانات القادمة من قاعدة البيانات.
    console.log("سيتم هنا كتابة كود الاتصال بالـ Backend بعد إعداده.");
}