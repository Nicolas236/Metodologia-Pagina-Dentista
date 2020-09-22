const form = $(".php-email-form")[0];
const name = $("#from_name");
const email = $("#from_email");
const tel = $("#tel");
const msg = $("#msg");
const selectBox = $("#type");
const btn = $("#submit");
const fileInput = $("#ficha");
let img = "";

const errorList = $("#errorList");

function addError(field) {
    errorList.append(`<li>El campo ${field} no es valido</li>`);
}

$("#ficha").on("change", readFile);

function validate() {
    // const name = $('#from_name');

    let check = true;

    if ($(name).val().trim() == "") {
        check = false;
        addError("Nombre");
    }

    if (
        $(email)
            .val()
            .trim()
            .match(
                /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
            ) == null
    ) {
        addError("Email");
        check = false;
    }
    if (
        $(tel)
            .val()
            .trim()
            .match(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/) == null
    ) {
        addError("Telefono");
        check = false;
    }

    if (fileInput.val() === null || fileInput.val() === "") {
        check = false;
        errorList.append("<li>Debe agregar su ficha medica</li>");
    }

    if (!check) {
        $(".error-div").css("display", "block");
    } else {
        $(".error-div").css("display", "none");
    }

    return check;
}

function getCheckboxes() {
    let days = [];
    let hours = [];

    let selectedValues = [];

    $.each($("input[name='day']:checked"), function () {
        days.push($(this).val());
    });
    $.each($("input[name='moment']:checked"), function () {
        hours.push($(this).val());
    });

    selectedValues[0] = days.length == 0 ? "No especifica" : days.join(", ");
    selectedValues[1] = hours.length == 0 ? "No especifica" : hours.join(", ");

    return selectedValues;
}

function readFile() {
    if (this.files && this.files[0]) {
        var FR = new FileReader();

        FR.addEventListener("load", function (e) {
            console.log(e.target.result);
            img = e.target.result;
        });

        FR.readAsDataURL(this.files[0]);
    }
}

function getDataUri(url, callback) {
    var image = new Image();

    image.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext("2d").drawImage(this, 0, 0);

        // Get raw image data
        callback(
            canvas
                .toDataURL("image/png")
                .replace(/^data:image\/(png|jpg);base64,/, "")
        );

        // ... or get as Data URI
        callback(canvas.toDataURL("image/png"));
    };

    image.src = url;
    img.crossOrigin = "Anonymous";
}

$("form").on("submit", function (event) {
    event.preventDefault();

    errorList.empty();

    console.log(img);

    if (!validate()) {
        return;
    }

    btn.text("Enviando...");

    const selectedValue = selectBox.children("option:selected").val(); //tipo de consulta

    const checkBoxes = getCheckboxes();

    const days = checkBoxes[0];
    const hours = checkBoxes[1];

    console.log(`${checkBoxes}\n${days}\n${hours}`);

    Email.send({
        Host: "smtp.elasticemail.com",
        Username: "lospiratasutn@gmail.com",
        Password: "656DC89B6C2547A989C6E8377DA12E200DC2",
        To: "lospiratasutn@gmail.com",
        From: "lospiratasutn@gmail.com",
        Subject: "Solicitud de Turno - Consultorio Sonrisa Feliz",
        Body: `Hola Doctora Sonrisa, tiene una nueva solicitud de turno. <br />

        Especificaciones del paciente: <br />

        Nombre: ${name.val()} <br />
        Email: ${email.val()} <br />
        Telefono: ${tel.val()} <br />
        Tipo de Consulta solicitada: ${selectedValue} <br />
        Dia(s) preferido(s): ${days} <br />
        Horario(s) preferido(s): ${hours} <br />
        Mensaje: ${msg.val()} <br />

        <strong>Ficha medica adjunta</strong>
        `,
        Attachments: [
            {
                name: `FM - ${name.val().toUpperCase()}.png`,
                data: img,
            },
        ],
    }).then(
        (message) => {
            btn.text("Solicitar Turno");
            swal({
                title: "Envio exitoso!",
                text:
                    "Tu solicitud se envio correctamente. La doctora se comunicara con usted a la brevedad.",
                icon: "success",
                button: {
                    text: "Entendido",
                    value: true,
                    visible: true,
                    className: "btn btn-primary btn-xl js-scroll-trigger",
                    closeModal: true,
                },
            });
            form.reset();
            fileInput.val(null);
        },
        (err) => {
            btn.text("Solicitar Turno");
            swal({
                title: "Error",
                text:
                    "Lo sentimos, ocurrio un error y tu solicitud no se envio correctamente",
                icon: "error",
                button: {
                    text: "Entendido",
                    value: true,
                    visible: true,
                    className: "btn btn-primary btn-xl js-scroll-trigger",
                    closeModal: true,
                },
            });
        }
    );
});
