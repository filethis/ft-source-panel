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
`<ft-create-connection-dialog>`

An element that accepts username and password to connect to a document source.

@demo
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js';

import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-input/iron-input.js';
import '@polymer/iron-label/iron-label.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/polymer/polymer-legacy.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style include="iron-flex iron-flex-alignment iron-positioning"></style>

        <style>
            :host {
                display: block;
                overflow: hidden;
                font-family: Arial, Helvetica, sans-serif;
                @apply --ft-create-connection-dialog;
            }
            #dialog {
                width: 500px;
                height: 400px;
                @apply --ft-create-connection-dialog-dialog;
            }
            #content {
                margin: 0;
                padding: 0;
                background-color: white;
                width: 100%;
                height: 100%;
                @apply --ft-create-connection-dialog-dialog;
            }
            #prompt {
                margin-top: 20px;
                font-size: 13px;
                font-style: italic;
                color: #343434;
                @apply --ft-create-connection-dialog-prompt;
            }
            #sourceName {
                margin-top: 10px;
                font-size: 24px;
                color: #343434;
                @apply --ft-create-connection-dialog-source-name;
            }
            #logoBox {
                margin-top: 10px;
                width: 150px;
                height: 65px;
                border: 1px solid #DEDEDE;
                @apply --ft-create-connection-dialog-logo-box;
            }
            #note {
                margin-top: 9px;
                font-size: 13px;
                color: #7F7F7F;
                display: none;
                @apply --ft-create-connection-dialog-note;
            }
            #usernameField {
                margin-left: 0;
                margin-top: 12px;
                margin-right: 0;
                margin-bottom: 0;
                width: 350px;
                padding: 0;
                font-size: 15px;
                color: #343434;
                @apply --ft-create-connection-dialog-username-field;
            }
            #passwordField {
                margin: 0;
                width: 350px;
                padding: 0;
                font-size: 15px;
                color: #343434;
                @apply --ft-create-connection-dialog-password-field;
            }
            #buttonGroup {
                margin-top: 20px;
                width: 200px;
                @apply --ft-create-connection-dialog-button-group;
            }
            #cancelButton {
                @apply --ft-create-connection-dialog-cancel-button;
            }
            #connectButton {
                @apply --ft-create-connection-dialog-connect-button;
            }
            #infoLink {
                margin-top: 25px;
                width: 350px;
                font-size: 15px;
                text-align: center;
                color: #3B7FBA;
                cursor:pointer;
                @apply --ft-create-connection-dialog-info-link;
            }
        </style>

        <paper-dialog id="dialog" modal="" on-iron-overlay-closed="_onClosed">
            <!-- Content -->
            <!-- Our paper-dialog parent is evil! It apparently injects a margin into its children -->
            <!-- Or if the first child does not have a background color! -->
            <!-- We use a "content" child with an explicitly empty margin to counteract this -->
            <div id="content" class="layout vertical center">

                <!-- Prompt -->
                <iron-label id="prompt">
                    Please enter your credentials for
                </iron-label>

                <!-- Source Name -->
                <div id="sourceName">
                    {{_sourceName}}
                </div>

                <!-- Logo Box -->
                <div id="logoBox" class="layout vertical center-center">
                    <!-- Logo -->
                    <img style="width:auto;" src="{{_sourceLogoUrl}}">
                    
                </div>

                <!-- Optional Note -->
                <div id="note">
                    {{_sourceNotes}}
                </div>

                <!-- Username -->
                <paper-input id="usernameField" autofocus="" label="Username" on-keyup="_onKeyUp" value="{{username}}">
                </paper-input>

                <!-- Password -->
                <paper-input id="passwordField" autofocus="" type="password" label="Password" on-keyup="_onKeyUp" value="{{password}}">
                </paper-input>

                <!-- Buttons -->
                <div id="buttonGroup" class="layout horizontal">

                    <!-- Cancel Button -->
                    <paper-button id="cancelButton" dialog-dismiss="" raised="" on-tap="_onCancelButtonClicked">
                        Cancel
                    </paper-button>

                    <!-- Spacer -->
                    <div class="flex"></div>

                    <!-- Connect Button -->
                    <paper-button id="connectButton" dialog-confirm="" autofocus="" raised="" disabled\$="{{!isValid}}" on-tap="_onConnectButtonClicked">
                        Connect
                    </paper-button>

                </div>

                <!-- Visit source site -->
                <div id="infoLink" class="link" on-tap="_onVisitSourceSiteButtonClicked">
                    Visit {{_sourceName}} website
                </div>
            </div>
        </paper-dialog>
`,

  is: 'ft-create-connection-dialog',

  /**
   * Fired when the dialog is committed.
   *
   * @event commit
   * @param {Object} detail The selected connection.
   */

  /**
   * Fired when the dialog is canceled.
   *
   * @event cancel
   */

  /**
   * Fired when the "Visit Site" button is clicked.
   *
   * @event visit-source-site
   * @param {Object} detail The source to be visited.
   */

  /**
   * Fired when the "Is this safe" button is clicked.
   *
   * @event is-this-safe
   */

  properties: {

      /** Username entered by the user. */
      username:
      {
          type: String,
          value: "",
          notify: true
      },

      /** Password entered by the user. */
      password:
      {
          type: String,
          value: "",
          notify: true
      },

      /** FileThis "source" resource. */
      source:
      {
          type: Object,
          value: null,
          notify: true
      },

      /**
       * Show "Is this safe" button at bottom of dialog.
       *
       * Note that you can provide the strings "true" and "false" as attribute values.
       *
       * @type {boolean}
       */
      showIsThisSafeButton:
      {
          type: Object,
          value: true,
          notify: true
      },

      /** True when the entered values are valid and the dialog can be committed. */
      isValid:
      {
          type: Boolean,
          value: false,
          notify: true
      },

      /** URL for source logo. Computed from the source resource property and bound to UI element. */
      _sourceLogoUrl:
      {
          type: String,
          computed: '_getSourceLogoUrl(source)'
      },

      /** Name of the source. Computed from the source resource property and bound to UI element. */
      _sourceName:
      {
          type: String,
          computed: '_getSourceName(source)'
      },

      /** Notes about the source, if any. Computed from the source resource property and bound to UI element. */
      _sourceNotes:
      {
          type: String,
          computed: '_getSourceNotes(source)'
      }
  },

  ready: function()
  {
      this.username = "";
      this.password = "";
      this._validateCredentials();
      this.$.usernameField.focus();
  },

  open: function()
  {
      var theDialog = this.$.dialog;
      theDialog.open();
  },

  _onClosed: function()
  {
      // Clear fields for safety
      this.username = "";
      this.password = "";
  },

  _credentialsAreValid: function()
  {
      if (this.username.length === 0)
          return false;
      if (this.password.length === 0)
          return false;
      return true;
  },

  _validateCredentials: function()
  {
      this.isValid = this._credentialsAreValid();
  },

  _onKeyUp: function(event)
  {
      this._validateCredentials();

      // TODO: Generalize this
      if (this.isValid)
      {
          var enterKeyWasHit = (event.keyCode === 13);
          if (enterKeyWasHit)
          {
              this.$.dialog.close();
              this._commit();
          }
      }
  },

  _onCancelButtonClicked: function(event, detail)
  {
      this.fire('cancel-command');
  },

  _onConnectButtonClicked: function(event, detail)
  {
      this._commit();
  },

  _commit: function()
  {
      this.fire('create-connection-command', this);
  },

  _onVisitSourceSiteButtonClicked: function(event, detail)
  {
      this.fire('visit-source-site-command', this.source);
  },

  _onIsThisSafeButtonClicked: function(event, detail)
  {
      this.fire('is-this-safe-command');
  },

  _getSourceLogoUrl: function(source)
  {
      if (source === null)
          return "";
      return source.logoUrl;
  },

  _getSourceName: function(source)
  {
      if (source === null)
          return "";
      return source.name;
  },

  _getSourceNotes: function(source)
  {
      if (source === null)
          return "";
      return source.notes;
  }
});
