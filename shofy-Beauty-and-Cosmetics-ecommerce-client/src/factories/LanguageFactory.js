class Language {
  constructor() {
    this.translations = {};
  }

  translate(key, params = {}) {
    let translation = this.translations[key] || key;
    
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{{${param}}}`, params[param]);
    });
    
    return translation;
  }
}

// English Language
class EnglishLanguage extends Language {
  constructor() {
    super();
    this.translations = {

      'nav.home': 'Home',
      'nav.contact': 'Contact',
      'nav.cart': 'Cart',
      
      'product.addToCart': 'Add to Cart',
      'product.buyNow': 'Buy Now',
      'product.price': 'Price',
      'product.description': 'Description',
      'product.reviews': 'Reviews',
      'product.inStock': 'In Stock',
      'product.outOfStock': 'Out of Stock',
      
      'cart.title': 'Shopping Cart',
      'cart.empty': 'No Cart Items Found',
      'cart.continueShopping': 'Continue Shopping',
      'cart.product': 'Product',
      'cart.price': 'Price',
      'cart.quantity': 'Quantity',
      'cart.subtotal': 'Subtotal',
      'cart.shipping': 'Shipping',
      'cart.total': 'Total',
      'cart.clearCart': 'Clear Cart',
      'cart.proceedToCheckout': 'Proceed to Checkout',
      'cart.flatRate': 'Flat rate',
      'cart.localPickup': 'Local pickup',
      'cart.freeShipping': 'Free shipping',
      'cart.remove': 'Remove',
      'cart.addMoreForFreeShipping': 'Add ${{amount}} more to qualify for free shipping',
      'cart.eligibleForFreeShipping': 'You are eligible for free shipping',
      
      'contact.title': 'Keep In Touch with Us',
      'contact.sendMessage': 'Send A Message',
      'contact.yourName': 'Your Name',
      'contact.yourEmail': 'Your Email',
      'contact.subject': 'Subject',
      'contact.yourMessage': 'Your Message',
      'contact.sendMessageBtn': 'Send Message',
      'contact.saveInfo': 'Save my name, email, and website in this browser for the next time I comment.',
      'contact.findOnSocial': 'Find on social media',
      'contact.writeSubject': 'Write your subject',
      'contact.writeMessage': 'Write your message here...',
      'contact.messageSent': 'Message sent successfully!',
      
      'checkout.title': 'Checkout',
      'checkout.shipping': 'Shipping Information',
      'checkout.payment': 'Payment Method',
      'checkout.review': 'Review Order',
      'checkout.placeOrder': 'Place Order',
      
      'payment.creditCard': 'Credit Card',
      'payment.paypal': 'PayPal',
      'payment.applePay': 'Apple Pay',
      'payment.googlePay': 'Google Pay',
      'payment.cod': 'Cash on Delivery',
      
      'form.firstName': 'First Name',
      'form.lastName': 'Last Name',
      'form.email': 'Email',
      'form.phone': 'Phone',
      'form.address': 'Address',
      'form.city': 'City',
      'form.zipCode': 'ZIP Code',
      'form.country': 'Country',
      
      'message.success': 'Success!',
      'message.error': 'Error occurred',
      'message.loading': 'Loading...',
      'message.orderPlaced': 'Order placed successfully',
      'message.paymentFailed': 'Payment failed',
      
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.view': 'View',
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.sort': 'Sort'
    };
  }
}

// Ukrainian Language
class UkrainianLanguage extends Language {
  constructor() {
    super();
    this.translations = {
        
      'nav.home': 'Головна',
      'nav.contact': 'Контакти',
      'nav.cart': 'Кошик',
      

      'product.addToCart': 'Додати в кошик',
      'product.buyNow': 'Купити зараз',
      'product.price': 'Ціна',
      'product.description': 'Опис',
      'product.reviews': 'Відгуки',
      'product.inStock': 'В наявності',
      'product.outOfStock': 'Немає в наявності',
      
      'cart.title': 'Кошик покупок',
      'cart.empty': 'Товарів в кошику не знайдено',
      'cart.continueShopping': 'Продовжити покупки',
      'cart.product': 'Товар',
      'cart.price': 'Ціна',
      'cart.quantity': 'Кількість',
      'cart.subtotal': 'Проміжний підсумок',
      'cart.shipping': 'Доставка',
      'cart.total': 'Всього',
      'cart.clearCart': 'Очистити кошик',
      'cart.proceedToCheckout': 'Перейти до оформлення',
      'cart.flatRate': 'Фіксована ставка',
      'cart.localPickup': 'Самовивіз',
      'cart.freeShipping': 'Безкоштовна доставка',
      'cart.remove': 'Видалити',
      'cart.addMoreForFreeShipping': 'Додайте ще ${{amount}} для безкоштовної доставки',
      'cart.eligibleForFreeShipping': 'Ви маєте право на безкоштовну доставку',
      
      'contact.title': 'Зв\'яжіться з нами',
      'contact.sendMessage': 'Надіслати повідомлення',
      'contact.yourName': 'Ваше ім\'я',
      'contact.yourEmail': 'Ваш email',
      'contact.subject': 'Тема',
      'contact.yourMessage': 'Ваше повідомлення',
      'contact.sendMessageBtn': 'Надіслати повідомлення',
      'contact.saveInfo': 'Зберегти моє ім\'я, email та веб-сайт у цьому браузері для наступного коментування.',
      'contact.findOnSocial': 'Знайти в соціальних мережах',
      'contact.writeSubject': 'Напишіть вашу тему',
      'contact.writeMessage': 'Напишіть ваше повідомлення тут...',
      'contact.messageSent': 'Повідомлення успішно надіслано!',
      
      'checkout.title': 'Оформлення замовлення',
      'checkout.shipping': 'Інформація про доставку',
      'checkout.payment': 'Спосіб оплати',
      'checkout.review': 'Перегляд замовлення',
      'checkout.placeOrder': 'Розмістити замовлення',
      
      'payment.creditCard': 'Кредитна картка',
      'payment.paypal': 'PayPal',
      'payment.applePay': 'Apple Pay',
      'payment.googlePay': 'Google Pay',
      'payment.cod': 'Оплата при отриманні',
      
      'form.firstName': 'Ім\'я',
      'form.lastName': 'Прізвище',
      'form.email': 'Електронна пошта',
      'form.phone': 'Телефон',
      'form.address': 'Адреса',
      'form.city': 'Місто',
      'form.zipCode': 'Поштовий індекс',
      'form.country': 'Країна',
      
      'message.success': 'Успішно!',
      'message.error': 'Сталася помилка',
      'message.loading': 'Завантаження...',
      'message.orderPlaced': 'Замовлення успішно оформлено',
      'message.paymentFailed': 'Платіж не вдався',
      
      'common.save': 'Зберегти',
      'common.cancel': 'Скасувати',
      'common.delete': 'Видалити',
      'common.edit': 'Редагувати',
      'common.view': 'Переглянути',
      'common.search': 'Пошук',
      'common.filter': 'Фільтр',
      'common.sort': 'Сортувати'
    };
  }
}

class LanguageFactory {
  static createLanguage(languageCode) {
    switch (languageCode.toLowerCase()) {
      case 'en':
      case 'english':
        return new EnglishLanguage();
      
      case 'uk':
      case 'ua':
      case 'ukrainian':
        return new UkrainianLanguage();
      
      default:
        console.warn(`Language ${languageCode} not supported, falling back to English`);
        return new EnglishLanguage();
    }
  }

  static getSupportedLanguages() {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' }
    ];
  }
}

class TranslationService {
  constructor(languageCode = 'en') {
    this.currentLanguage = LanguageFactory.createLanguage(languageCode);
    this.languageCode = languageCode;
  }

  setLanguage(languageCode) {
    this.currentLanguage = LanguageFactory.createLanguage(languageCode);
    this.languageCode = languageCode;
  }

  t(key, params = {}) {
    return this.currentLanguage.translate(key, params);
  }

  getCurrentLanguage() {
    return this.languageCode;
  }

  getSupportedLanguages() {
    return LanguageFactory.getSupportedLanguages();
  }
}

module.exports = {
  LanguageFactory,
  TranslationService,
  EnglishLanguage,
  UkrainianLanguage
};