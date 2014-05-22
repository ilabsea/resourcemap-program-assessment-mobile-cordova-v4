var jquery_validation = {
    kh:{
        required: "វាលនេះត្រូវបានទាមទារ",
        remote: "សូមកែវាលនេះ.",
        email: "សូមបញ្ចូលអ៊ីមែលដែលត្រឹមត្រូវ",
        url: "សូមផ្ដល់នូវ URL ដែលត្រឹមត្រូវ.",
        date: "សូមបញ្ចូលកាលបរិច្ឆេទត្រឹមត្រូវ",
        dateISO: "សូមផ្តល់នូវកាលបរិច្ឆេទត្រឹមត្រូវ (ISO).",
        number: "សូមបញ្ចូលនូវលេខដែលត្រឹមត្រូវ",
        digits: "Veuillez fournir seulement des chiffres.",
        creditcard: "Veuillez fournir un numéro de carte de crédit valide.",
        equalTo: "Veuillez fournir encore la même valeur.",
        extension: "Veuillez fournir une valeur avec une extension valide.",
        maxlength: $.validator.format("Veuillez fournir au plus {0} caractères."),
        minlength: $.validator.format("Veuillez fournir au moins {0} caractères."),
        rangelength: $.validator.format("Veuillez fournir une valeur qui contient entre {0} et {1} caractères."),
        range: $.validator.format("Veuillez fournir une valeur entre {0} et {1}."),
        max: $.validator.format("Veuillez fournir une valeur inférieure ou égale à {0}."),
        min: $.validator.format("Veuillez fournir une valeur supérieure ou égale à {0}."),
       
    },
   en:{
        required: "This field is required.",
		remote: "Please fix this field.",
		email: "Please enter a valid email address.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		dateISO: "Please enter a valid date (ISO).",
		number: "Please enter a valid number.",
		digits: "Please enter only digits.",
		creditcard: "Please enter a valid credit card number.",
		equalTo: "Please enter the same value again.",
		maxlength: $.validator.format("Please enter no more than {0} characters."),
		minlength: $.validator.format("Please enter at least {0} characters."),
		rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
		range: $.validator.format("Please enter a value between {0} and {1}."),
		max: $.validator.format("Please enter a value less than or equal to {0}."),
		min: $.validator.format("Please enter a value greater than or equal to {0}.")
    }
};

