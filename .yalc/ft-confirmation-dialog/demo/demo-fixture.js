/* ft-confirmation-dialog element demo */
/* Imports */
/**

An element that provides a configurable confirmation dialog.

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
import '../ft-confirmation-dialog.js';
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

        <div class="layout vertical center">

            <ft-confirmation-dialog id="dialog"></ft-confirmation-dialog>

            <!-- Alert button -->
            <paper-button raised="" on-tap="_alert">Alert</paper-button>

            <div style="height:20px"></div>

            <!-- Confirm button -->
            <paper-button raised="" on-tap="_confirm">Confirm</paper-button>

            <div style="height:20px"></div>

            <!-- Fancy button -->
            <paper-button raised="" on-tap="_fancy">Fancy</paper-button>

        </div>
`,

  is: 'demo-fixture',

  _alert: function()
  {
      this.$.dialog.alert("You are a wonderful human being. You are a wonderful human being. You are a wonderful human being. You are a wonderful human being. You are a wonderful human being. You are a wonderful human being. ");
  },

  _confirm: function()
  {
      this.$.dialog.confirm("Do you want to frobnicate the discombobulator?");
  },

  // NOTE: Image used here is in the public domain: https://pixabay.com/en/wow-bang-explosion-pow-blast-155268/
  _fancy: function()
  {
      this.$.dialog.alert("You can use _Markdown_ in your dialogs.<br><br>![Amazing!](wow.png)<br><br>```wow() { return \"That is fantastic!\"; " +
          "}```<br><br>That's just __great__!");
  }
});
