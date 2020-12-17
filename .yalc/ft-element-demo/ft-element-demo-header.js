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
`<ft-element-demo-header>`

An element that can be used as a header for an element demo. Displays the name of the element and buttons that open its GitHub repo and documentation page.

@demo
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';

import '@polymer/iron-pages/iron-pages.js';
import 'ft-labeled-icon-button/ft-labeled-icon-button.js';
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
                height: 60px;
                background-color: white;
                border-bottom: 1px solid #DDD;
                padding-left: 16px;
                padding-right: 16px;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --ft-element-demo;
            }
        </style>

        <!-- Element name -->
        <iron-label style="font-family:Arial; font-size: 16pt; white-space:nowrap; ">
            &lt;[[name]]&gt;
        </iron-label>

        <!-- Spacer -->
        <div class="flex"></div>

        <!-- GitHub repository button -->
        <ft-labeled-icon-button style="padding-left:8px; " icon="cloud-queue" label="Repo" on-tap="_onRepoButtonTapped">
        </ft-labeled-icon-button>

        <!-- Documentation button -->
        <ft-labeled-icon-button id="documentationButton" icon="info-outline" label="Docs" on-tap="_onDocumentationButtonClicked">
        </ft-labeled-icon-button>
`,

  is: 'ft-element-demo-header',

  properties: {

      name: {
          type: String,
          notify: true,
          value: "ft-thing"
      }
  },

  _onDocumentationButtonClicked: function(event, detail)
  {
      var url = "https://filethis.github.io/" + this.name;
      this._openUrl(url);
  },

  _onRepoButtonTapped: function(event)
  {
      var url = "https://github.com/filethis/" + this.name;
      this._openUrl(url);
  },

  _openUrl: function(url)
  {
      var win = window.open(url, '_blank');
      if (win)
          win.focus();
      else
          this.$.confirmationDialog.alert("Please allow popups for this site");
  }
});
