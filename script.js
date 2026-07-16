// 1. إعدادات فايربيس (ضع الكود الذي نسخته من موقع فايربيس هنا بدلاً من النجوم)

const firebaseConfig = {
  apiKey: "AIzaSyCfXbg5Yje-AvuSw5MPN2wU2h7NnxHZUec",
  authDomain: "custom-table-20f77.firebaseapp.com",
  projectId: "custom-table-20f77",
  storageBucket: "custom-table-20f77.firebasestorage.app",
  messagingSenderId: "856732153510",
  appId: "1:856732153510:web:11b816c92532b26ac46667"
};



// تهيئة الاتصال بفايربيس
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // أ. كود صفحة لوحة التحكم (إضافة المنتجات لقاعدة البيانات)
    // ----------------------------------------------------
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // منع تحديث الصفحة
            
            const name = document.getElementById('productName').value;
            const category = document.getElementById('productCategory').value;
            const description = document.getElementById('productDescription').value;
            const imageUrl = document.getElementById('productImageUrl').value;
            
            const submitBtn = document.querySelector('.submit-btn');
            submitBtn.textContent = 'جاري الحفظ...';
            submitBtn.disabled = true;

            try {
                // حفظ البيانات في جدول اسمه (products)
                await db.collection("products").add({
                    name: name,
                    category: category,
                    description: description,
                    imageUrl: imageUrl,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp() // تاريخ الإضافة لترتيبها
                });
                
                alert('تم إضافة المنتج للمتجر بنجاح!');
                addProductForm.reset(); // تفريغ الخانات لمنتج جديد
            } catch (error) {
                console.error("خطأ في الحفظ: ", error);
                alert('حدث خطأ! تأكد من إعدادات قاعدة البيانات.');
            } finally {
                submitBtn.textContent = 'حفظ وإضافة المنتج';
                submitBtn.disabled = false;
            }
        });
    }

    // ----------------------------------------------------
    // ب. كود الصفحة الرئيسية (جلب المنتجات وعرضها)
    // ----------------------------------------------------
    const diningCarousel = document.getElementById('dining-carousel');
    const centerCarousel = document.getElementById('center-carousel');

    if (diningCarousel || centerCarousel) {
        // إذا كنا في الصفحة الرئيسية، قم بتشغيل دوال الجلب والتمرير
        loadProductsFromDB();
        setupCarouselButtons();
    }

    // ----------------------------------------------------
    // ج. كود الطلب عبر الواتساب (يعمل في كل الصفحة)
    // ----------------------------------------------------
    // ضع رقمك الفعلي هنا (مثال: 966500000000)
    const phoneNumber = "9665XXXXXXXX"; 
    
    // نستخدم طريقة ذكية لمراقبة النقرات حتى للمنتجات التي يتم إضافتها لاحقاً من الداتابيس
    document.body.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('whatsapp-btn')) {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.getAttribute('data-name');
            const message = `مرحباً لافوتنا، أريد الاستفسار أو الطلب بخصوص: ${productName}`;
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        }
    });

}); // نهاية DOMContentLoaded


// دالة جلب المنتجات من فايربيس
async function loadProductsFromDB() {
    const diningCarousel = document.getElementById('dining-carousel');
    const centerCarousel = document.getElementById('center-carousel');

    try {
        // جلب المنتجات مرتبة من الأحدث للأقدم
        const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
        
        // تفريغ الحاويات 
        if(diningCarousel) diningCarousel.innerHTML = '';
        if(centerCarousel) centerCarousel.innerHTML = '';

        snapshot.forEach(doc => {
            const product = doc.data();
            
            // كود الـ HTML الخاص بكرت المنتج
            const productCard = `
                <div class="product-card" data-name="${product.name}">
                    <img src="${product.imageUrl}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/220x200?text=صورة+غير+متاحة'">
                    <div class="product-info">
                        <button class="whatsapp-btn">اطلب عبر الواتساب</button>
                    </div>
                </div>
            `;

            // توجيه المنتج للقسم الصحيح
            if (product.category === 'dining' && diningCarousel) {
                diningCarousel.innerHTML += productCard;
            } else if (product.category === 'center' && centerCarousel) {
                centerCarousel.innerHTML += productCard;
            }
        });

    } catch (error) {
        console.error("حدث خطأ أثناء جلب المنتجات: ", error);
        // رسالة تظهر في الموقع إذا فشل الجلب
        if(diningCarousel) diningCarousel.innerHTML = '<p style="padding:20px;">جاري تجهيز المنتجات...</p>';
    }
}

// دالة أزرار التمرير (الأسهم)
function setupCarouselButtons() {
    const wrappers = document.querySelectorAll('.carousel-wrapper');
    wrappers.forEach(wrapper => {
        const carousel = wrapper.querySelector('.products-carousel');
        const rightBtn = wrapper.querySelector('.right-btn');
        const leftBtn = wrapper.querySelector('.left-btn');
        const scrollAmount = 240; 

        rightBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        leftBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    });
}
