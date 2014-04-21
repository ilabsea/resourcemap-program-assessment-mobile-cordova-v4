var EmployeeView = function(adapter, template, employee) {

    this.initialize = function() {
        this.el = $('<div/>');
        this.el.on('click', '.change-pic-btn', this.changePicture);
    };

    this.render = function() {
        this.el.html(template(employee));
        return this;
    };

    this.changePicture = function(event) {
        event.preventDefault();
        if (!navigator.camera) {
            alert("Camera API not supported", "Error");
            return;
        }
        var options =   {   quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Album
            encodingType: 0     // 0=JPG 1=PNG
        };

        navigator.camera.getPicture(
            function(imageData) {
                $('.employee-image', this.el).attr('src', "data:image/jpeg;base64," + imageData);
            },
            function() {
                alert('Error taking picture', 'Error');
            },
            options);

        return false;
    };

    this.initialize();

}