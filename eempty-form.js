    !function(t) {
        let e = "custom-form",
            r = "custom-form-submit",
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
                let t = document.querySelectorAll(`.${e}`);
                if (0 === t.length) {
                    console.error("[TKFORM] Не найдено ни одной формы с классом", e);
                    return
                }
                let r = new Set;
                t.forEach(t => {
                    let e = t.closest(".t-rec");
                    e && r.add(e)
                });
                if (0 === r.size) {
                    console.error("[TKFORM] Не найдено ни одного зеро блока с формами");
                    return
                }
                i(t), s(r), a(t)
            },
            i = t => {
                t.forEach(t => {
                    const submit = t.querySelector(".tn-form__submit");
                    if (submit) submit.remove();
                });
            },
            a = t => {
                t.forEach(form => {
                    Array.prototype.slice.call(
                        form.querySelectorAll(".t-input:not(.t-inputquantity):not(.t-input-phonemask__wrap):not(.t-input-phonemask):not(.t-input__own-answer)")
                    ).forEach(inputWrap => {
                        const input = inputWrap.querySelector("input, textarea");
                        if (input) {
                            input.addEventListener("blur", function() {
                                this.value ?
                                    inputWrap.classList.add("t-input_has-content") :
                                    inputWrap.classList.remove("t-input_has-content")
                            });
                        }
                    });
                });
            },
            s = t => {
                t.forEach(block => {
                    let o = block.querySelector(".t396__artboard"),
                        n = block.querySelectorAll(`.${e}`),
                        i = block.querySelector(`.${r}`);

                    if (!o) {
                        console.error("[TKFORM] Не найден элемент t396__artboard в блоке:", block);
                        return false;
                    }

                    if (n.length === 0) {
                        console.error(`[TKFORM] Не найдено ни одной формы с классом ${e} в блоке`, block);
                        return false;
                    }

                    if (!i) {
                        console.error(`[TKFORM] Не найдено кнопки submit с классом ${r} в блоке`, block);
                        return false;
                    }

                    let a = o.dataset.artboardRecid ?
                        "tk-form" + o.dataset.artboardRecid :
                        "tk-form" + Math.floor(1e5 + 9e5 * Math.random());

                    let s = document.createElement("div");
                    s.innerHTML = `<form class="t-form t-form_inputs-total_2 js-form-proccess" id="${a}" name="form778879734" action="https://forms.tildacdn.com/procces/ " method="POST" role="form" data-formactiontype="2" data-inputbox=".t-input-group" data-success-callback="t396_onSuccess" data-success-popup="y" data-error-popup="y"></form>`;
                    let u = s.firstChild;

                    n.forEach(formBlock => {
                        let form = formBlock.querySelector("form");
                        if (!form) {
                            console.error("[TKFORM] Не найдена форма в элементе", formBlock);
                            return false;
                        }

                        let wrapper = document.createElement("div");
                        [...form.attributes].forEach(attr => wrapper.setAttribute(attr.name, attr.value));
                        wrapper.append(...form.cloneNode(true).childNodes);
                        form.replaceWith(wrapper);
                        u.appendChild(wrapper);
                    });

                    u.appendChild(i);
                    o.appendChild(u);
                    l(u, i);
                });
            },
            l = (formElement, button) => {
                if (!formElement) {
                    console.error("[TKFORM] Не найдено комбинированной формы");
                    return false;
                }

                if (!button) {
                    console.error(`[TKFORM] Не найдено кнопки submit в форме`, formElement);
                    return false;
                }

                button.setAttribute("type", "submit");
                button.setAttribute("tabindex", "0");
                button.setAttribute("onKeyDown", "tkForm.handleSubmitKeyDown(event)");
                let style = button.getAttribute("style") || "";
                button.setAttribute("style", style + " cursor: pointer;");
                button.addEventListener("click", e => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.tildaForm.hideErrors(formElement);
                    let errors = window.tildaForm.validate(formElement);
                    if (errors.length) {
                        window.tildaForm.showErrors(formElement, errors);
                        return;
                    }
                    if (!window.t_forms__initBtnClick) {
                        console.error("[TKFORM] Функция t_forms__initBtnClick не инициализирована");
                        return false;
                    }
                    window.t_forms__initBtnClick(e);
                });

                button.classList.add("t-submit");

                t_onReady(function() {
                    setTimeout(function() {
                        if (window.t_upwidget__init) {
                            t_zeroForms__onFuncLoad("t_upwidget__init", () => button.classList.remove("t-submit"));
                        } else {
                            button.classList.remove("t-submit");
                        }
                    }, 500);
                });
            };

        t.tkForm = {
            init: o,
            handleSubmitKeyDown: function(e) {
                if (e.keyCode === 13 || e.keyCode === 32) {
                    e.preventDefault();
                    e.target.dispatchEvent(new Event("click"));
                }
            }
        };
    }(window);
