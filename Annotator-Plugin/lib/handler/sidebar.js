var CompositeDisposable, SidebarView, View;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
View = require('atom-space-pen-views').View;
CompositeDisposable = require('atom').CompositeDisposable;

module.exports = SidebarView = (function() {
        __extends(SidebarView, View);
        function SidebarView() {
          SidebarView.__super__.constructor.apply(this, arguments);
        }
        SidebarView.content = function() {
          return this.div({
            "class": 'tool-panel panel-right side-pane'
          }, __bind(function() {

            this.div({
                "class": 'annotation-box'
              }, __bind(function() {

                this.div({'class':'title'},"HELLO WORLD")

                return this.button({
                  outlet: 'gutterColorCycle',
                  "class": 'btn'
                }, 'Wooop Wooop');
              }, this));



            // BOTTON BOX
            return this.div({
              "class": 'btn-toolbar'
            }, __bind(function() {
              this.div({
                "class": 'btn-group'
              }, __bind(function() {
                this.button({
                  outlet: 'gutterToggle',
                  "class": 'btn'
                }, '<< Back');
                this.button({
                  outlet: 'gutterColorCycle',
                  "class": 'btn'
                }, 'Prev');
                return this.button({
                  outlet: 'gutterColorCycle',
                  "class": 'btn'
                }, 'Next');
              }, this));

            }, this));
          }, this));
        };

        SidebarView.prototype.initialize = function() {

        };

        SidebarView.prototype.attach = function() {
            return atom.workspace.addRightPanel({
              item: this,
              priority: 0
            })
        };

        SidebarView.prototype.display_annotation = function(annotation) {
          atom.notifications.addSuccess("Would update sidebar: \n"+JSON.stringify(annotation))
        };

        return SidebarView;
})();
