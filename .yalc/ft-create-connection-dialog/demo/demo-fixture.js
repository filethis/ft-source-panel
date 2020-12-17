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
/* ft-create-connection-dialog element demo */
/* Imports */
/**

An element that accepts username and password to connect to a document source.

@demo
 */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/

import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/polymer/polymer-legacy.js';
import '../ft-create-connection-dialog.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer
({
  _template: html`
        <style include="iron-flex iron-flex-alignment iron-positioning"></style>

        <style>
            :host {
                display: block;
                overflow: hidden;
            }
        </style>

        <div class="horizontal center-justified layout" style="width:100%; padding-left: 16px; padding-right: 16px;">

            <paper-button raised="" id="poseButton" style="font-family:Arial" on-tap="_onPoseButtonClicked">
                Pose Dialog
            </paper-button>

            <ft-create-connection-dialog id="dialog">
            </ft-create-connection-dialog>

        </div>
`,

  is: 'demo-fixture',

  properties:
  {
  },

  ready: function()
  {
      // TODO: Refactor to use ft-http-behavior
      var path = "source.json";

      var xmlHttpRequest = new XMLHttpRequest();
      xmlHttpRequest.overrideMimeType("application/json");
      xmlHttpRequest.open('GET', path, true);
      xmlHttpRequest.onreadystatechange = function()
      {
          if (xmlHttpRequest.readyState === 4 &&
              xmlHttpRequest.status === 200)
          {
              this.$.dialog.source = JSON.parse(xmlHttpRequest.responseText);
          }
      }.bind(this);
      xmlHttpRequest.send();

  },

  _onPoseButtonClicked: function()
  {
      // Pose the modal dialog
      var theDialog = this.$.dialog;
      theDialog.open();
  }
});
