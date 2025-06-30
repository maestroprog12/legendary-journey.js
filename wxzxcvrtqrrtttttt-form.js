!function(t) {
    let e = ".custom-form",
        r = ".custom-form-submit",
        o = (t = {}) => {
            e = t.formClass || e;
            r = t.customSubmitClass || r;

            t_onReady(() => {
                t_onFuncLoad("t_zeroForms__onReady", () => {
                    n()
                })
            })
        },
        n = () => {
            let t = document.querySelectorAll(e);
            if (0 === t.length) {
                console.error("[TKFORM] Не найдено ни одной формы с классом", e);
                return
            }
            let r = new Set;
            if (t.forEach(t => {
                    let e = t.closest(".t-rec");
                    e && r.add(e)
                }), 0 === r.length) {
                console.error("[TKFORM] Не найдено ни одного зеро блока с формами");
                return
            }
            i(t), s(r), a(t)
        },
        i = t => {
            t.forEach(t => t.querySelector(".tn-form__submit")?.remove())
        },
        a = t => {
            t.forEach(t => {
                Array.prototype.slice.call(t.querySelectorAll(".t-input:not(.t-inputquantity):not(.t-input-phonemask__wrap):not(.t-input-phonemask):not(.t-input__own-answer)")).forEach(function(t) {
                    t.addEventListener("blur", function(t) {
                        t.target.value ? t.target.classList.add("t-input_has-content") : t.target.classList.remove("t-input_has-content")
                    })
                })
            })
        },
        s = t => {
            t.forEach(t => {
                let o = t.querySelector(".t396__artboard"),
                    n = t.querySelectorAll(e),
                    i = t.querySelector(r);
                if (!o) return console.error("[TKFORM] Не найден элемент t396__artboard в блоке:", t), !1;
                if (0 === n.length) return console.error(`[TKFORM] Не найдено ни одной формы с классом ${e} в блоке`, t), !1;
                if (!i) return console.error(`[TKFORM] Не найдено кнопки submit с классом ${r} в блоке`, t), !1;
                let a = o.dataset.artboardRecid ? "tk-form" + o.dataset.artboardRecid : "tk-form" + Math.floor(1e5 + 9e5 * Math.random()),
                    s = document.createElement("div");
                s.innerHTML = `<form class="t-form t-form_inputs-total_2 js-form-proccess" id="${a}" name="form778879734" action="https://forms.tildacdn.com/procces/        " method="POST" role="form" data-formactiontype="2" data-inputbox=".t-input-group" data-success-callback="t396_onSuccess" data-success-popup="y" data-error-popup="y"></form>`;
                let u = s.childNodes[0];
                n.forEach(t => {
                    let e = t.querySelector("form");
                    if (!e) return console.error("[TKFORM] Не найдено формы в элементе", t), !1;
                    let r = document.createElement("div");
                    [...e.attributes].forEach(t => r.setAttribute(t.name, t.value)), r.append(...e.cloneNode(true).childNodes), e.replaceWith(r), u.appendChild(t)
                }), u.appendChild(i), o.appendChild(u), l(u, i)
            })
        },
        l = (form, btn) => {
            if (!form) return console.error("[TKFORM] Не найдено комбинированной формы"), !1;
            if (!btn) return console.error(`[TKFORM] Не найдено кнопки submit в форме`, form), !1;

            btn.setAttribute("type", "submit");
            btn.setAttribute("tabindex", "0");
            btn.setAttribute("onKeyDown", "tkForm.handleSubmitKeyDown(event)");
            let r = btn.getAttribute("style");
            btn.setAttribute("style", r + " cursor: pointer;");
            btn.classList.add("t-submit");

            btn.addEventListener("click", function handleClick(evt) {
                evt.preventDefault();
                evt.stopPropagation();

                window.tildaForm.hideErrors(form);
                let errors = window.tildaForm.validate(form);

                if (errors.length) {
                    console.error('[TKFORM] Ошибки валидации:', errors);
                    window.tildaForm.showErrors(form, errors);
                    return;
                }

                if (!t_forms__initBtnClick) {
                    console.error("[TKFORM] Функция t_forms__initBtnClick не инициализирована на странице");
                    return;
                }

                // Отправляем форму стандартным способом Tilda
                t_forms__initBtnClick(evt);

                // Ждём успешную отправку через события Tilda
                document.addEventListener('t-form-submitted-successfully', (e) => {
                    if (e.detail.formId === form.id) {
                        console.log('Форма успешно отправлена!');
                        if (typeof t396_onSuccess === 'function') {
                            console.log('[TKFORM] Вызов t396_onSuccess');
                            t396_onSuccess(); // показываем popup "Спасибо"
                        }
                        setTimeout(() => {
                            window.location.reload(); // обновляем страницу
                        }, 5000);
                    }
                });

                // Начинаем отслеживание попапа
                waitForSuccessPopupAndReload();
            });

            btn.addEventListener("keydown", function (e) {
                tkForm.handleSubmitKeyDown(e);
            });

            t_onReady(function () {
                setTimeout(function () {
                    window.t_upwidget__init ? t_zeroForms__onFuncLoad("t_upwidget__init", () => btn.classList.remove("t-submit")) : btn.classList.remove("t-submit")
                }, 500)
            })
        };

    // === Основная функция: ждём попап "Спасибо" и обновляем через 5 секунд ===
    function waitForSuccessPopupAndReload() {
        const body = document.body;

        // Проверяем сразу — вдруг попап уже показан
        const successPopupAlreadyShown = document.querySelector('.t-form-success-popup_window');
        if (successPopupAlreadyShown) {
            console.log('[TKFORM] Попап уже показан → запускаем обновление через 5 секунд');

            setTimeout(() => {
                console.log('[TKFORM] Убираем попап перед обновлением');
                const wrapper = document.querySelector('.t-form-success-popup_wrapper');
                if (wrapper) wrapper.remove(); // убираем попап
                console.log('[TKFORM] Обновляем страницу...');
                window.location.reload();
            }, 5000);

            return;
        }

        console.log('[TKFORM] Ждём появления .t-form-success-popup_window');

        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const popup = document.querySelector('.t-form-success-popup_window');
                    if (popup) {
                        observer.disconnect();

                        console.log('[TKFORM] Попап найден → запускаем таймер на 5 секунд');

                        setTimeout(() => {
                            console.log('[TKFORM] Скрываем попап и обновляем страницу...');
                            const wrapper = document.querySelector('.t-form-success-popup_wrapper');
                            if (wrapper) wrapper.remove(); // убираем попап
                            window.location.reload();
                        }, 5000);
                    }
                }
            }
        });

        observer.observe(body, {
            childList: true,
            subtree: true
        });
    }

    t.tkForm = {
        init: o,
        handleSubmitKeyDown: function t(e) {
            (13 === e.keyCode || 32 === e.keyCode) && (e.preventDefault(), e.target.dispatchEvent(new Event("click")))
        }
    }
}(window);
