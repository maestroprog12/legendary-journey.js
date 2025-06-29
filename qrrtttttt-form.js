! function(t) {
    let e = ".custom-form",
        r = ".custom-form-submit",
        o = (t = {}) => {
            console.log('[TKFORM] Инициализация tkForm.init()');
            e = t.formClass || e;
            r = t.customSubmitClass || r;

            t_onReady(() => {
                console.log('[TKFORM] t_onReady выполнен');
                t_onFuncLoad("t_zeroForms__onReady", () => {
                    console.log('[TKFORM] t_zeroForms__onReady загружен');
                    n()
                })
            })
        },
        n = () => {
            console.log('[TKFORM] Начало обработки форм');

            let t = document.querySelectorAll(e);
            if (0 === t.length) {
                console.error("[TKFORM] Не найдено ни одной формы с классом", e);
                return
            }

            let r = new Set;
            t.forEach(t => {
                let e = t.closest(".t-rec");
                e && r.add(e)
            });

            if (0 === r.length) {
                console.error("[TKFORM] Не найдено ни одного зеро блока с формами");
                return
            }

            console.log(`[TKFORM] Найдено ${t.length} форм с классом "${e}"`);
            console.log(`[TKFORM] Найдено ${r.size} блоков .t-rec`);

            i(t), s(r), a(t)
        },
        i = t => {
            console.log(`[TKFORM] Удаление стандартных кнопок submit`);
            t.forEach(t => t.querySelector(".tn-form__submit")?.remove())
        },
        a = t => {
            console.log(`[TKFORM] Добавление обработчиков blur для полей ввода`);

            t.forEach(t => {
                Array.prototype.slice.call(t.querySelectorAll(".t-input:not(.t-inputquantity):not(.t-input-phonemask__wrap):not(.t-input-phonemask):not(.t-input__own-answer)")).forEach(function(t) {
                    t.addEventListener("blur", function(evt) {
                        evt.target.value
                            ? evt.target.classList.add("t-input_has-content")
                            : evt.target.classList.remove("t-input_has-content");
                        console.log(`[TKFORM] Поле ввода обновило состояние:`, evt.target);
                    })
                })
            })
        },
        s = t => {
            console.log(`[TKFORM] Сборка объединённых форм`);

            t.forEach(t => {
                let o = t.querySelector(".t396__artboard"),
                    n = t.querySelectorAll(e),
                    i = t.querySelector(r);

                if (!o) return console.error("[TKFORM] Не найден элемент t396__artboard в блоке:", t), !1;
                if (0 === n.length) return console.error(`[TKFORM] Не найдено ни одной формы с классом ${e} в блоке`, t), !1;
                if (!i) return console.error(`[TKFORM] Не найдено кнопки submit с классом ${r} в блоке`, t), !1;

                let a = o.dataset.artboardRecid
                        ? "tk-form" + o.dataset.artboardRecid
                        : "tk-form" + Math.floor(1e5 + 9e5 * Math.random()),
                    s = document.createElement("div");

                console.log(`[TKFORM] Создание новой формы с ID: ${a}`);

                s.innerHTML = `<form class="t-form t-form_inputs-total_2 js-form-proccess" id="${a}" name="form778879734" action="https://forms.tildacdn.com/procces/     " method="POST" role="form" data-formactiontype="2" data-inputbox=".t-input-group" data-success-callback="t396_onSuccess" data-success-popup="y" data-error-popup="y"></form>`;
                let u = s.childNodes[0];

                n.forEach(t => {
                    let e = t.querySelector("form");
                    if (!e) return console.error("[TKFORM] Не найдено формы в элементе", t), !1;

                    console.log(`[TKFORM] Форма внутри блока найдена:`, e);

                    let r = document.createElement("div");
                    [...e.attributes].forEach(t => r.setAttribute(t.name, t.value));
                    r.append(...e.cloneNode(true).childNodes);
                    e.replaceWith(r);
                    u.appendChild(t)
                });

                u.appendChild(i);
                o.appendChild(u);
                l(u, i);
            })
        },
        l = (form, btn) => {
            if (!form) return console.error("[TKFORM] Не найдено комбинированной формы"), !1;
            if (!btn) return console.error(`[TKFORM] Не найдено кнопки submit в форме`, form), !1;

            console.log(`[TKFORM] Настройка кнопки отправки...`);

            btn.setAttribute("type", "submit");
            btn.setAttribute("tabindex", "0");
            btn.setAttribute("onKeyDown", "tkForm.handleSubmitKeyDown(event)");
            let r = btn.getAttribute("style");
            btn.setAttribute("style", r + " cursor: pointer;");
            btn.classList.add("t-submit");

            btn.addEventListener("click", function handleClick(evt) {
                console.log(`[TKFORM] Кнопка отправки нажата`);

                evt.preventDefault();
                evt.stopPropagation();

                window.tildaForm.hideErrors(form);
                console.log(`[TKFORM] Очистка старых ошибок`);

                let errors = window.tildaForm.validate(form);
                if (errors.length) {
                    console.warn(`[TKFORM] Валидация провалена`, errors);
                    window.tildaForm.showErrors(form, errors);
                    return;
                }
                console.log(`[TKFORM] Форма успешно прошла валидацию`);

                if (!t_forms__initBtnClick) {
                    console.error("[TKFORM] Функция t_forms__initBtnClick не инициализирована на странице");
                    return;
                }

                console.log(`[TKFORM] Отправляем форму через Tilda`);

                // Отправляем форму стандартным способом Tilda
                t_forms__initBtnClick(evt);

                const formId = form.id;
                console.log(`[TKFORM] Подписываемся на событие t-form-submitted-successfully для формы #${formId}`);

                const formSubmitHandler = (e) => {
                    if (e.detail.formId === formId) {
                        console.log(`[TKFORM] Форма #${formId} успешно отправлена`);

                        if (typeof t396_onSuccess === 'function') {
                            console.log(`[TKFORM] Вызов t396_onSuccess`);
                            t396_onSuccess(); // показываем popup "Спасибо"
                        }

                        console.log(`[TKFORM] Через 500 мс произойдёт перезагрузка страницы`);
                        setTimeout(() => {
                            window.location.reload(); // обновляем страницу
                        }, 500);
                    }
                };

                document.addEventListener('t-form-submitted-successfully', formSubmitHandler, { once: true });

                // Дополнительное наблюдение за классом .t-form__success
                waitForFormSuccess(form, () => {
                    console.log(`[TKFORM] Форма #${form.id} получила класс .t-form__success`);
                });
            });

            btn.addEventListener("keydown", function (e) {
                console.log(`[TKFORM] Нажатие клавиши в кнопке отправки`);
                tkForm.handleSubmitKeyDown(e);
            });

            t_onReady(function () {
                setTimeout(function () {
                    if (window.t_upwidget__init) {
                        console.log(`[TKFORM] t_upwidget__init доступен`);
                        t_zeroForms__onFuncLoad("t_upwidget__init", () => {
                            btn.classList.remove("t-submit");
                            console.log(`[TKFORM] Убран класс .t-submit у кнопки`);
                        });
                    } else {
                        btn.classList.remove("t-submit");
                        console.log(`[TKFORM] t_upwidget__init НЕ доступен, убран класс .t-submit`);
                    }
                }, 500)
            })
        };

    function waitForFormSuccess(form, callback) {
        console.log(`[TKFORM] Начинаем отслеживание .t-form__success для формы #${form.id}`);

        const observer = new MutationObserver(() => {
            if (form.classList.contains('t-form__success')) {
                console.log(`[TKFORM] Форма #${form.id} получила класс .t-form__success`);
                observer.disconnect();
                callback();
            }
        });

        observer.observe(form, {
            attributes: true,
            attributeFilter: ['class']
        });

        // Fallback: если успех не пришёл через 5 секунд
        setTimeout(() => {
            if (!form.classList.contains('t-form__success')) {
                console.warn(`[TKFORM] Форма #${form.id} не получила .t-form__success за 5 секунд`);
            }
        }, 5000);
    }

    t.tkForm = {
        init: o,
        handleSubmitKeyDown: function t(e) {
            if (13 === e.keyCode || 32 === e.keyCode) {
                console.log(`[TKFORM] Enter или пробел нажаты, имитируем клик`);
                e.preventDefault();
                e.target.dispatchEvent(new Event("click"));
            }
        }
    }
}(window);
