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
`<ft-css-editor>`

aaaaaaaaa

@demo
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';

import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-label/iron-label.js';
import 'juicy-ace-editor/juicy-ace-editor.js';
import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style include="iron-flex iron-flex-alignment iron-positioning"></style>

        <style>
            :host {
                display: block;
                overflow: hidden;
                min-width:400px;
                @apply --layout-vertical;
            }

            .validBorder { padding:3px; }
            .errorBorder { border: 3px solid red; }
        </style>

        <!-- Header -->
        <div class="layout horizontal end" style="padding-top:16px; padding-bottom: 8px; ">

            <!-- Heading -->
            <iron-label style="font-family:Arial; font-size: 12pt; ">
                &lt;[[stylable.name]]&gt;
            </iron-label>

            <div class="flex"></div>

            <!-- GitHub repository button -->
            <ft-labeled-icon-button style="padding-left:8px; " icon-src="../github.svg" label="Repo" on-tap="_onSourcesButtonTapped">
            </ft-labeled-icon-button>

            <!-- API documentation button -->
            <ft-labeled-icon-button style="padding-left:10px; " icon="info-outline" label="API" on-tap="_onDocumentationButtonTapped">
            </ft-labeled-icon-button>
        </div>

        <!-- Editor -->
        <juicy-ace-editor id="editor" theme="ace/theme/terminal" mode="ace/mode/css" fontsize="14px" softtabs="" tabsize="4"></juicy-ace-editor>
`,

  is: 'ft-css-editor',

  properties: {

      stylable: {
          type: Object
      }
  },

  ready: function()
  {
      // Suppress deprecation warning
      this.$.editor.editor.$blockScrolling = Infinity;

      // TODO: The "editor" property is undefined when the ready() method is called. That seems wrong. Fix.
      this.async(function()
      {
          var editor = this.$.editor;
          var editorInternal = this.$.editor.editor;
          var session = editorInternal.getSession();

          session.addEventListener("changeAnnotation", this._onChangeAnnotation.bind(this));

          editorInternal.setOptions({
              maxLines:Infinity,
              minLines:3
          });

          editor.value = this.stylable.value;

          editorInternal.selection.selectFileStart();

          this.stylable.editor = editor;

      }.bind(this), 100)
  },

  _onDocumentationButtonTapped: function(event)
  {
      var url = "https://filethis.github.io/" + this.stylable.name;
      this._openUrl(url);
  },

  _onSourcesButtonTapped: function(event)
  {
      var url = "https://github.com/filethis/" + this.stylable.name;
      this._openUrl(url);
  },

  _openUrl: function(url)
  {
      var win = window.open(url, '_blank');
      if (win)
          win.focus();
      else
          this.$.confirmationDialog.alert("Please allow popups for this site");
  },

  _onChangeAnnotation: function(event)
  {
      var session = this.$.editor.editor.getSession();
      var annotations = session.getAnnotations();
      this.stylable.isValid = (annotations.length === 0);

      if (this.stylable.isValid)
      {
          this.$.editor.classList.remove("errorBorder");
          this.$.editor.classList.add("validBorder");
      }
      else // invalid
      {
          this.$.editor.classList.remove("validBorder");
          this.$.editor.classList.add("errorBorder");
      }
  }
});
