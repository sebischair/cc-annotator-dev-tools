'use babel';

var modal = {};
var annotator = {};

module.exports = class AnnotationModal {

  constructor (state, annot) {
    annotator = annot;
    this.data = state;
    modal = this
    console.log(self);
    console.log(annotator);
    this.element = document.createElement('div');
    this.message = document.createElement('span');
    this.button  = document.createElement('button');
    var t = document.createTextNode("CLICK ME");
    this.textNode = document.createTextNode(this.data.content);

    this.button.classList.add('btn');
    this.element.classList.add('annotation-modal');

    this.message.appendChild(this.textNode);
    this.element.appendChild(this.message);
    this.button.appendChild(t);
    this.element.appendChild(this.button);

    this.button.addEventListener("click", modal.destroy);
  }

  serialize () {
    return {
      data: this.data
    };
  }

  destroy () {
    console.log(annotator);
    modal.element.remove();
    annotator.modal.hide();
    //annotator.toggle_modal();
  }

  getElement () {
    return this.element;
  }

}
