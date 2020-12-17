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
`<ft-confirmation-dialog>`

An element that provides a configurable alert or confirmation dialog that returns a Promise when invoked.

@demo
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';

import '@polymer/marked-element/marked-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/polymer/polymer-legacy.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
Polymer({
  _template: html`
        <style include="iron-flex iron-flex-alignment iron-positioning"></style>

        <style>
            :host {
                display: block;
                overflow: hidden;
                --paper-dialog-background-color: #FAFAFA;
                @apply --ft-confirmation-dialog;
            }
        </style>

        <paper-dialog modal="" id="dialog" class="layout vertical" style="
                width: 500px;
                overflow: hidden;
                padding-left: 20px;
                padding-right: 20px;
            ">
            <!-- Prompt -->
            <div id="promptScroller" style="
                    overflow: auto;
                    max-height:300px;
                    background-color: white;
                    border: 1px solid #DDD;
                ">
                <marked-element id="prompt" markdown="[[_prompt]]">
                    <div class="markdown-html"></div>
                </marked-element>
            </div>

            <!-- Buttons -->
            <div id="buttons" class="layout horizontal end-justified">
                <!-- Cancel -->
                <paper-button id="cancelButton" dialog-dismiss="" raised="">
                    [[_cancelButtonLabel]]
                </paper-button>

                <div id="cancelButtonSpacer" style="width:20px"></div>

                <!-- Okay -->
                <paper-button dialog-confirm="" raised="" autofocus="">[[_commitButtonLabel]]</paper-button>
            </div>

        </paper-dialog>
`,

  is: 'ft-confirmation-dialog',

  behaviors: [
      IronResizableBehavior,
  ],

  properties: {

      /** A copy of the prompt string given in the _alert()_ or _confirm()_ method call. Bound to the display element.  */
      _prompt: {
          type: String
      },
      
      /** A copy of the commit button label string given in the _alert()_ or _confirm()_ method call. Bound to the button element label.  */
      _commitButtonLabel: {
          type: String,
          value: "Okay"
      },
      
      /** A copy of the cancel button label string given in the _confirm()_ method call. Bound to the button element label.  */
      _cancelButtonLabel: {
          type: String,
          value: "Cancel"
      }
  },

  /**
   * Display a modal alert dialog with the given prompt text. Does not block.
   *
   * @param {String} prompt The text to display in the dialog. Markdown is supported.
   * @param {String} commitButtonLabel _optional_ The string to use for the button that dismisses the dialog.
   * @return {Object} A promise that resolves to the string "commit" when the user dismisses the dialog.
   */
  alert: function(prompt, commitButtonLabel)
  {
      this.$.cancelButton.hidden = true;
      this.$.cancelButtonSpacer.hidden = true;

      if (!!prompt)
          this._prompt = prompt;
      else
          this._prompt = "Alert";

      return this._pose(prompt, commitButtonLabel);
  },

  /**
   * Display a modal alert dialog with the given prompt text. Does not block.
   *
   * Emits a either a _commit_ or a _cancel_ event when the user dismisses the dialog, depending on which
   * button they clicked.
   *
   * @param {String} prompt The text to display in the dialog. Markdown is supported.
   * @param {String} commitButtonLabel _optional_ The string to use for the button that commits the dialog.
   * @param {String} cancelButtonLabel _optional_ The string to use for the button that cancels the dialog.
   * @return {Object} A promise that resolves to the string "commit" or a "cancel" event when the user
   * dismisses the dialog, depending on which button they clicked.
   */
  confirm: function(prompt, commitButtonLabel, cancelButtonLabel)
  {
      this.$.cancelButton.hidden = false;
      this.$.cancelButtonSpacer.hidden = false;

      if (!!prompt)
          this._prompt = prompt;
      else
          this._prompt = "Are you sure you want to do this?";

      if (!!cancelButtonLabel)
          this._cancelButtonLabel = cancelButtonLabel;
      else
          this._commitButtonLabel = "Cancel";

      return this._pose(prompt, commitButtonLabel);
  },

  _pose: function(prompt, commitButtonLabel)
  {
      // Override dumb default that disables Escape keyboard equivalent for cancel
      this.$.dialog.noCancelOnEscKey = false;

      if (!!commitButtonLabel)
          this._commitButtonLabel = commitButtonLabel;
      else
          this._commitButtonLabel = "Okay";

      return new Promise(function(resolve, reject)
      {
          this.$.dialog.open();

          this.doneListener = function doneListener(event)
              {
                  this.$.dialog.removeEventListener("iron-overlay-closed", this.doneListener);

                  var choice;
                  var closingReason = event.detail;
                  if (closingReason.canceled || !closingReason.confirmed)  // Huh?
                      choice = "cancel";
                  else
                      choice = "commit";

                  resolve(choice);
              }.bind(this);

          this.$.dialog.addEventListener("iron-overlay-closed", this.doneListener)
      }.bind(this))
  }
});
