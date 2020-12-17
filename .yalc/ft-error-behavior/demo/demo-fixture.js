/* ft-error-behavior element demo */
/* Imports */
/**

A behavior that provides error reporting.

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
import '../ft-error-behavior.js';
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

        <!-- Bad Function Call -->
        <div class="layout vertical center">
            <paper-button raised="" on-tap="_badFunctionCall">Bad Function Call</paper-button>
        </div>

        <div style="height:20px"></div>

        <!-- Throw error -->
        <div class="layout vertical center">
            <paper-button raised="" on-tap="_throwError">Throw error</paper-button>
        </div>
`,

  is: 'demo-fixture',
  behaviors: [FileThis.ErrorBehavior],

  _badFunctionCall: function()
  {
      this._badFunction();
  },

  _throwError: function()
  {
      throw new Error("Something bad happened");
  }
});
