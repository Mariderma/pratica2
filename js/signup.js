document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signupForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');

    const fields = {
        fullname: {
            input: document.getElementById('fullname'),
            error: document.getElementById('error-fullname'),
            validate: value => value.trim().length >= 3,
            message: 'Debe tener al menos 3 caracteres.'
        },
        email: {
            input: document.getElementById('email'),
            error: document.getElementById('error-email'),
            validate: value => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
            message: 'Ingrese un correo válido.'
        },
        password: {
            input: document.getElementById('password'),
            error: document.getElementById('error-password'),
            validate: value => /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(value),
            message: 'Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.'
        },
        confirmPassword: {
            input: document.getElementById('confirmPassword'),
            error: document.getElementById('error-confirmPassword'),
            validate: value => value === fields.password.input.value,
            message: 'Las contraseñas no coinciden.'
        },
        birthdate: {
            input: document.getElementById('birthdate'),
            error: document.getElementById('error-birthdate'),
            validate: value => {
                if (!value) return false;
                const birth = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birth.getFullYear();
                const m = today.getMonth() - birth.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                    return age - 1 >= 18;
                }
                return age >= 18;
            },
            message: 'Debes tener al menos 18 años.'
        },
        cellphone: {
            input: document.getElementById('cellphone'),
            error: document.getElementById('error-cellphone'),
            validate: value => /^3[0-9]{9}$/.test(value),
            message: 'Debe ser un número celular colombiano válido (10 dígitos, inicia con 3).'
        },
        phone: {
            input: document.getElementById('phone'),
            error: document.getElementById('error-phone'),
            validate: value => value === '' || (/^\d{10,}$/.test(value)),
            message: 'Debe tener al menos 10 dígitos numéricos.'
        },
        terms: {
            input: document.getElementById('terms'),
            error: document.getElementById('error-terms'),
            validate: value => value,
            message: 'Debes aceptar los términos.'
        }
    };

    function validateField(field) {
        const value = field.input.type === 'checkbox' ? field.input.checked : field.input.value;
        if (field.validate(value)) {
            field.input.classList.remove('invalid');
            field.input.classList.add('valid');
            field.error.textContent = '';
            return true;
        } else {
            field.input.classList.remove('valid');
            field.input.classList.add('invalid');
            field.error.textContent = field.message;
            return false;
        }
    }

    function validateForm() {
        let valid = true;
        Object.values(fields).forEach(field => {
            if (!validateField(field)) valid = false;
        });
        submitBtn.disabled = !valid;
        return valid;
    }

    Object.values(fields).forEach(field => {
        field.input.addEventListener('input', function () {
            validateForm();
        });
        if (field.input.type === 'checkbox') {
            field.input.addEventListener('change', function () {
                validateForm();
            });
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
            // Muestra error de reCAPTCHA
            return;
        }
        if (validateForm()) {
            successMessage.textContent = '¡Registro exitoso!';
            form.reset();
            Object.values(fields).forEach(field => {
                field.input.classList.remove('valid', 'invalid');
            });
            submitBtn.disabled = true;
        } else {
            successMessage.textContent = '';
        }
    });
});
