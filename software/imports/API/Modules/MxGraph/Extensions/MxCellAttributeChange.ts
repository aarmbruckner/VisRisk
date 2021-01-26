export default class MxCellAttributeChange {
    cell: any;
    attribute: any;
    value: any;
    previous: any;
    // constructor
    constructor(cell, attribute, value) {
      this.cell = cell;
      this.attribute = attribute;
      this.value = value;
      this.previous = value;
    }

    // Method
    execute() {
      if (this.cell != null) {
        var tmp = this.cell.getAttribute(this.attribute);
        if (this.previous == null) {
          this.cell.value.removeAttribute(this.attribute);
        } else {
          this.cell.setAttribute(this.attribute, this.previous);
        }
        this.previous = tmp;
      }
    }
  }