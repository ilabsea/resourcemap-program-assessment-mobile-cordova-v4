var jquery_validation = {
  kh: {
    required: "ប្រអប់នេះតម្រូវអេាយបំពេញ",
    remote: "សូមកែវាលនេះ.",
    email: "សូមបញ្ចូលអ៊ីមែលដែលត្រឹមត្រូវ",
    url: "សូមផ្ដល់នូវ URL ដែលត្រឹមត្រូវ.",
    date: "សូមបញ្ចូលកាលបរិច្ឆេទត្រឹមត្រូវ",
    dateISO: "សូមផ្តល់នូវកាលបរិច្ឆេទត្រឹមត្រូវ (ISO).",
    number: "សូមបញ្ចូលនូវលេខដែលត្រឹមត្រូវ",
    digits: "សូមបញ្ចូលតួលេខប៉ុណ្ណោះ។",
    creditcard: "សូមបញ្ចូលនូវលេខកាតឥណទានដែលត្រឹមត្រូវ។",
    equalTo: "សូមបញ្ចូលតម្លៃដូចគ្នានេះម្តងទៀត។",
    extension: "Veuillez fournir une valeur avec une extension valide.",
    maxlength: $.validator.format("សូមបញ្ចូលមិនលើសពី {0} តួអក្សរ។"),
    minlength: $.validator.format("សូមបញ្ចូលយ៉ាងហោចណាស់ {0} តួអក្សរ។"),
    rangelength: $.validator.format("សូមបញ្ចូលតម្លៃចន្លោះ {0} និង {1} តួអក្សរ។"),
    range: $.validator.format("សូមបញ្ចូលតម្លៃចន្លោះ {0} និង {1} ។"),
    max: $.validator.format("សូមបញ្ចូលតម្លៃតិចជាងឬស្មើទៅនឹង {0}។"),
    min: $.validator.format("សូមបញ្ចូលតម្លៃមួយធំជាងឬស្មើ {0}។")
  },
  en: {
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