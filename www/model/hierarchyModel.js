Hierarchy = {
    _display: "",
    _data: [],
    _value: "",
    setData: function(field) {
        this._data = field["hierarchy"];
    },
    generateField: function(field, value) {
        this._display = "";
        this._value = value;
        this.setData(field);
        this.processHierarchy(this._data, 0);
        return this._display;
    },
    processHierarchy: function(data, nbSpace) {
        for (var i = 0; i < data.length; i++) {
            this._display += this.renderItemOption(data[i], nbSpace);

            if (data[i].sub) {
                this.processHierarchy(data[i].sub, nbSpace + 3);
            }
        }
    },
    renderItemOption: function(record, nbSpace) {
        var label = this.generateSpace(nbSpace) + record.name;
        if(record.id == this._value)
            return "<option value='" + record.id + "' selected>" + label + "</option>";
        else 
            return "<option value='" + record.id + "'>" + label + "</option>"; 

    },
    generateSpace: function(nbSpace) {
        var totalSpace = "";
        for (var i = 0; i < nbSpace; i++) {
            totalSpace += "&nbsp;";
        }
        return totalSpace;
    }
};