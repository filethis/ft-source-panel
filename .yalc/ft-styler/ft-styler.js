/*
Copyright 2018 FileThis, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/**
`<ft-styler>`

aaaaaaaaa

@demo
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import 'ft-clipboard-behavior/ft-clipboard-behavior.js';

import 'ft-confirmation-dialog/ft-confirmation-dialog.js';
import 'ft-labeled-icon-button/ft-labeled-icon-button.js';
import './ft-css-declaration-editor.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-label/iron-label.js';
import 'juicy-ace-editor/juicy-ace-editor.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
        <style include="iron-flex iron-flex-alignment iron-positioning"></style>

        <style>
            :host {
                display: block;
                overflow: hidden;
                min-width:400px;
                padding-left: 16px;
                padding-right: 16px;
                @apply --layout-vertical;
            }
        </style>

        <!-- Element header -->
        <div class="layout horizontal center" style="padding-top:10pt; padding-bottom: 10pt; ">
            <!-- Heading -->
            <iron-label id="myheading" style="font-family:Arial; font-size: 14pt; ">
                CSS
            </iron-label>

            <div class="flex"></div>

            <!-- Example button -->
            <ft-labeled-icon-button id="exampleButton" icon="dashboard" label="Sample" on-tap="_onExampleButtonClicked">
            </ft-labeled-icon-button>

            <!-- Copy button -->
            <ft-labeled-icon-button id="copyCssButton" icon="content-copy" label="Copy" on-tap="_onCopyCssButtonClicked">
            </ft-labeled-icon-button>

            <!-- Apply -->
            <ft-labeled-icon-button id="applyButton" icon="exit-to-app" label="Apply" on-tap="_onApplyButtonClicked">
            </ft-labeled-icon-button>
        </div>

        <!-- Generated CSS -->
        <juicy-ace-editor id="css" readonly="" style="border:1px solid #DDD; " theme="ace/theme/chrome" mode="ace/mode/text" fontsize="14px" softtabs="" tabsize="4">
        </juicy-ace-editor>

        <!-- Declaration header -->
        <div class="layout horizontal center" style="padding-top:10pt; padding-bottom: 5pt; ">

            <!-- Heading -->
            <iron-label style="font-family:Arial; font-size: 12pt; ">
                Declarations
            </iron-label>

            <div class="flex"></div>

            <!-- New button -->
            <ft-labeled-icon-button id="newDeclarationButton" icon="add" label="New" on-tap="_onNewDeclarationButtonClicked">
            </ft-labeled-icon-button>
        </div>

        <!-- Declaration List -->
        <div class="scroll" style="padding-bottom:12px; border: 1px solid #DDD; ">
            <template is="dom-repeat" items="{{declarations}}" as="declaration">
                <ft-css-declaration-editor declaration="[[declaration]]">
                </ft-css-declaration-editor>
            </template>
        </div>

        <!-- Confirmation dialog -->
        <ft-confirmation-dialog id="confirmationDialog">
        </ft-confirmation-dialog>
`,

  is: 'ft-styler',
  behaviors: [FileThis.ClipboardBehavior],

  observers: [
      '_onDeclarationsListChanged(declarations.splices)'
  ],

  listeners:
  {
      'delete-declaration-command': '_onDeleteDeclarationCommand',
      'declaration-changed': '_onDeclarationChanged'
  },

  properties: {

      target: {
          type: Object,
          notify: true,
      },

      name: {
          type: String,
          notify: true,
          value: "ft-thing",
          observer: "_onSettingChanged",
      },

      css: {
          type: String,
          notify: true,
      },

      _declarations: {
          type: Array,
          notify: true,
          value: function () {
                  return []
              },
      },

      _addedDeclarations: {
          type: Array,
          value: [],
      },

      _deletedDeclarations: {
          type: Array,
          value: [],
      },

      _modifiedDeclarations: {
          type: Array,
          value: [],
      },
  },

  ready: function()
  {
      // Suppress deprecation warning
      this.$.css.editor.$blockScrolling = Infinity;

      // TODO: The "editor" property is undefined when the ready() method is called. That seems wrong. Fix.
      this.async(function()
      {
          var editor = this.$.css;
          var editorInternal = editor.editor;
          var session = editorInternal.getSession();

          // Disable syntax checking
          session.setUseWorker(false);

          editorInternal.setOptions({
              maxLines:Infinity,
              minLines:3
          });

          // TODO: Remove this after testing
          this._addDeclaration({
              name: "color",
              value: "red"
          });
          this._addDeclaration({
              name: "padding",
              value: "12px"
          });
          this._addDeclaration({
              name:"background-color",
              value: "green"
          });
          this._addDeclaration({
              name:"font-family",
              value: "Ariel"
          });
          this._applyDeclarationChanges();
      }.bind(this), 100)
  },

  _addDeclaration: function(declaration)
  {
      // If we already have a declaration with the same name and value, short circuit
      var alreadyAdded = this._listContainsDeclarationWithNameAndValue(this._addedDeclarations, declaration);
      if (alreadyAdded)
          return;

      // If we previously deleted a declaration with the same name and value, remove the deletion record
      this._removeDeclarationWithNameAndValueFrom(declaration, this._deletedDeclarations);

      // Give this declaration a unique ID
      declaration.id = this._generateGuid();

      // Record the addition of the declaration
      this._addedDeclarations.push(declaration);
      
      // Add it to the main list
      this._declarations.push(declaration);
  },

  _deleteDeclarationWithId: function(id)
  {
      var alreadyDeleted = this._listContainsDeclarationWithNameAndValue(this._deletedDeclarations, declaration);
      if (alreadyDeleted)
          return;

      this._removeDeclarationWithNameAndValueFrom(declaration, this._addedDeclarations);
      this._removeDeclarationWithNameAndValueFrom(declaration, this._modifiedDeclarations);

      this._deletedDeclarations.push(declaration);
  },

  _modifyDeclaration: function(declaration)
  {
      var alreadyModified = this._listContainsDeclarationWithNameAndValue(this._modifiedDeclarations, declaration);
      if (alreadyModified)
          return;

      this._modifiedDeclarations.push(declaration);
  },

  _removeDeclarationWithNameAndValueFrom: function(declaration, list)
  {
      var index = this._findDeclarationIndexByNameAndValueIn(declaration, list);
      if (index < 0)
          return;
      list.splice(index, 1);
  },

  _findDeclarationIndexByNameAndValueIn: function(declaration, list)
  {
      var name = declaration.name;
      var value = declaration.value;
      var count = list.length;
      for (var index = 0; index < count; index++)
      {
          var element = list[index];
          if (element.name !== name)
              continue;
          if (element.value !== value)
              continue;
          return index;
      }
      return -1;
  },

  _listContainsDeclarationWithNameAndValue: function(list, declaration)
  {
      var index = this._findDeclarationIndexByNameAndValueIn(declaration, list);
      return (index >= 0);
  },

  _applyDeclarationChanges: function()
  {
      // TODO
  },

  _onSettingChanged: function()
  {
      this._settingChangedDebouncer = Debouncer.debounce
      (
          this._settingChangedDebouncer,
          timeOut.after(60),
          this._onSettingChangedDebounced.bind(this)
      );
  },

  _onSettingChangedDebounced: function()
  {
      this._generateCss();
  },

  _generateCss: function()
  {
      var css = ":host > * {";
      css += "\n    --" + this.name + ": {";

      this._declarations.forEach(function(declaration)
      {
          css += "\n        " + declaration.name + ": " + declaration.value + ";";
      });

      css += "\n    }";
      css += "\n}";

      var editor = this.$.css;
      var editorInternal = editor.editor;
      editor.value = css;
      editorInternal.selection.selectFileStart();
  },

  _onNewDeclarationButtonClicked: function(event)
  {
      var declaration = {
          name: "foo",
          value: "bar"
      };

      // Add the declaration
      var index = this._declarations.indexOf(declaration);
      this.push('_declarations', declaration);
  },

  _onDeleteDeclarationCommand: function(event)
  {
      var declaration = event.detail;

      // Remove the given declaration
      var index = this._declarations.indexOf(declaration);
      this.splice('_declarations', index, 1);
  },

  _onApplyButtonClicked: function(event, detail)
  {
      // Check for invalid declarations
      var invalidDeclarations = this._collectInvalidDeclarations();
      var someDeclarationIsInvalid = (invalidDeclarations.length > 0);
      if (someDeclarationIsInvalid)
      {
          // Scroll to the first one
//                    var firstInvalidDeclaration = invalidDeclarations[0];
//                    var editor = firstInvalidDeclaration.editor;
//                    if (editor !== null)
//                        editor.scrollIntoView();

          // Display dialog to user
          message = "The following CSS declarations are invalid and need to be corrected:<br><br>";
          invalidDeclarations.forEach(function(declaration)
          {
              message += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;" + declaration.name + "&gt;<br>";
          });
          this.$.confirmationDialog.alert(message);
          return;
      }

      this._applyAllDeclarations();
  },

  _onCopyCssButtonClicked: function(event, detail)
  {
      this.copyTextToClipboard(this.css);
  },

  _onExampleButtonClicked: function(event, detail)
  {
  },

  _applyAllDeclarations: function()
  {
      var target = this.target;
      if (!target)
          return;

      var styles = [];
      this._declarations.forEach(function(declaration)
      {
          // Build css expression for this declaration
          var style = {};
          style.name = declaration.name;
          style.value = declaration.value;

          styles.push(style);
      }.bind(this));

      var elements = [];
      var targetRoot = target.root;
      var element = dom(targetRoot).querySelector("#mystyleable");
      if (element)
           elements = [element];

      elements.forEach(function(element)
      {
          // Remove all styles
          element.removeAttribute("style");

          // Apply all given styles
          styles.forEach(function(style)
          {
              element.style[style.name] = style.value;
          }.bind(this));

      }.bind(this));
  },

  // To remove a style:  element.style.removeProperty("background-color");

  _collectInvalidDeclarations: function()
  {
      var invalidStylables = [];
      var count = this._declarations.length;
      for (var index = 0;
           index < count;
           index++)
      {
          var declaration = this._declarations[index];
          if (!this._declarationIsValid(declaration))
              invalidStylables.push(declaration);
      }
      return invalidStylables;
  },

  _declarationIsValid: function(declaration)
  {
      return true;
  },

  // Declarations list changes

  _onDeclarationChanged: function(event)
  {
      this._onSettingChanged();
  },

  _onDeclarationsListChanged: function(changeRecord)
  {
      if (!changeRecord)
          return;
      this._onSettingChanged();
  },

  _generateGuid: function()
  {
      function s4()
      {
          return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
      }

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
  }
});
