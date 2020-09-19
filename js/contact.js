(function ($) {
  "use strict";

  /*==================================================================
    [ Focus Contact2 ]*/
  $(".input2").each(function () {
    $(this).on("blur", function () {
      if ($(this).val().trim() != "") {
        $(this).addClass("has-val");
      } else {
        $(this).removeClass("has-val");
      }
    });
  });

  /*==================================================================
    [ Validate ]*/
  const name = $('.validate-input input[name="name"]');
  const email = $('.validate-input input[name="email"]');
  const phone = $('.validate-input input[name="phone"]');
  const date = $('.validate-input input[name="date")');
  const hour = $('.validate-input input[name="hour")');
  const message = $('.validate-input textarea[name="message"]');
  console.log(date);
  $(".validate-form").on("submit", function (e) {
    e.preventDefault();

    var check = true;

    if ($(name).val().trim() == "") {
      showValidate(name);
      check = false;
    }

    if (
      $(email)
        .val()
        .trim()
        .match(
          /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
        ) == null
    ) {
      showValidate(email);
      check = false;
    }

    if ($(message).val().trim() == "") {
      showValidate(message);
      check = false;
    }

    if (check) {
      const data = {
        apikey:
          "D8DD3A1561DEA33B60C436B01AAA511E87624DA2BED9BB2AA811468E57F01F82B5D4317787C8112BEBE39459EEA4ABCE",
        subject: "Prueba",
        to: "lospiratasutn@gmail.com",
        from: email.val(),
        bodyText:
          message.val() +
          "hora" +
          hour.val() +
          "dia" +
          date.val() +
          "phone" +
          phone.val(),
        isTransactional: false
      };

      sendEmail(data);
    }

    return check;
  });

  $(".validate-form .input2").each(function () {
    $(this).focus(function () {
      hideValidate(this);
    });
  });

  function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass("alert-validate");
  }

  function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass("alert-validate");
  }

  function sendEmail(data) {
    const service_id = "gmail";
    const template_id = "contacto";
    const myForm = $(".validate-form");

    myForm.find("button").text("Enviando...");
    emailjs.sendForm(service_id, template_id, myForm[0]).then(
      function () {
        swal({
          title: "Envio exitoso!",
          text:
            "Tu mensaje se envio correctamente, te responderemos a la brevedad.",
          icon: "success",
          button: "Perfecto, Gracias!"
        });
        myForm.find("button").text("Enviar");
      },
      function (err) {
        swal({
          title: "Error",
          text:
            "Lo sentimos, ocurrio un error y tu mensaje no se envio correctamente",
          icon: "error",
          button: "Entendido"
        });
        //alert("Send email failed!\r\n Response:\n " + JSON.stringify(err));
        myForm.find("button").text("Enviar");
      }
    );
  }
})(jQuery);
