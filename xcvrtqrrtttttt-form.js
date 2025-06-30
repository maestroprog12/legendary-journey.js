function waitForSuccessPopupAndReload() {
    const body = document.body;

    console.log('[TKFORM] Начинаем отслеживание .t-body_success-popup-shown');

    // Проверяем сразу — вдруг попап уже показан
    if (body.classList.contains('t-body_success-popup-shown')) {
        console.log('[TKFORM] Попап уже показан → обновляем через 5 секунд');
        setTimeout(() => {
            console.log('[TKFORM] Убираем класс .t-body_success-popup-shown');
            body.classList.remove('t-body_success-popup-shown'); // Убираем класс
            console.log('[TKFORM] Обновляем страницу...');
            window.location.reload(); // обновляем страницу
        }, 5000);
        return;
    }

    console.log('[TKFORM] Ждём появления .t-body_success-popup-shown');

    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (body.classList.contains('t-body_success-popup-shown')) {
                    observer.disconnect(); // перестаём наблюдать
                    console.log('[TKFORM] Попап успешно показан');

                    if (typeof t396_onSuccess === 'function') {
                        console.log('[TKFORM] Вызов t396_onSuccess');
                        t396_onSuccess(); // показываем popup "Спасибо"
                    } else {
                        console.warn('[TKFORM] Функция t396_onSuccess не определена');
                    }

                    console.log('[TKFORM] Через 5 секунд произойдёт обновление');
                    setTimeout(() => {
                        console.log('[TKFORM] Убираем класс .t-body_success-popup-shown');
                        body.classList.remove('t-body_success-popup-shown'); // Убираем класс
                        console.log('[TKFORM] Обновляем страницу...');
                        window.location.reload(); // обновляем страницу
                    }, 5000);
                }
            }
        }
    });

    observer.observe(body, {
        attributes: true,
        attributeFilter: ['class']
    });
}
