define([
  'underscore',
  'mockup-patterns-filemanager-url/js/basepopover'
], function(_, PopoverView) {
  'use strict';

  var RenameView = PopoverView.extend({
    className: 'popover addnew',
    title: _.template('<%= _t("Rename") %>'),
    content: _.template(
      '<span class="current-path"></span>' +
      '<div class="form-group">' +
        '<label for="filename-field"><%= _t("Filename") %></label>' +
        '<input type="text" class="form-control" ' +
                'id="filename-field">' +
      '</div>' +
      '<button class="btn btn-block btn-primary"><%= _t("Rename") %></button>'
    ),
    events: {
      'click button': 'renameButtonClicked'
    },
    toggle: function(button, e) {
      PopoverView.prototype.toggle.apply(this, [button, e]);
      var self = this;
      if (!self.opened) {
        return;
      }
      var node = self.app.getSelectedNode();
      self.$('input').val(node.name);
      self.$('.current-path').html(self.app.getNodePath(node));
    },
    renameButtonClicked: function(e) {
      var self = this;
      var $input = self.$('input');
      var filename = $input.val();
      if (filename) {
        self.app.doAction('renameFile', {
          type: 'POST',
          data: {
            path: self.app.getNodePath(),
            filename: filename
          },
          success: function(data) {
            self.hide();
            self.data = data;
            self.app.refreshTree(function() {
              var path;
              var oldPath;
              if (self.data.newParent != '/') {
                path = [self.data.newParent, self.data.newName].join('/');
                oldPath = [self.data.oldParent, self.data.oldName].join('/');
              } else {
                path = '/' + self.data.newName;
                oldPath = '/' + self.data.oldName;
              }

              if (self.app.fileData[path] !== undefined) {
                self.app.refreshFile(path);
              } else {
                self.app.selectItem(path);
              }

              self.app.closeTab(oldPath);
              delete self.data;
            });
          }
        });
        // XXX show loading
      } else {
        self.$('.form-group').addClass('has-error');
      }
    }
  });

  return RenameView;
});
