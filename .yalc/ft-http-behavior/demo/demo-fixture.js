/* ft-http-behavior element demo */
/* Imports */
/**

A behavior that provides HTTP requests using Promises.

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
import '../ft-http-behavior.js';
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

        <!-- GET Success -->
        <div class="layout vertical center">
            <paper-button raised="" on-tap="_getSuccess">GET Success</paper-button>
        </div>

        <div style="height:20px"></div>

        <!-- GET Failure -->
        <div class="layout vertical center">
            <paper-button raised="" on-tap="_getFailure">GET Failure</paper-button>
        </div>
`,

  is: 'demo-fixture',

  behaviors: [
      FileThis.ErrorBehavior,
      FileThis.HttpBehavior
  ],

  _getFailure: function()
  {
      this.httpGet("https://filethis.com/foo")
          .then(function(result)
          {
              alert(result);
          }.bind(this))
          .catch(function(reason)
          {
              this.handleCaughtError(reason);
          }.bind(this));
  },

  _getSuccess: function()
  {
      this.httpGet(window.location)
          .then(function(result)
          {
              alert(result);
          }.bind(this))
          .catch(function(reason)
          {
              this.handleCaughtError(reason);
          }.bind(this));
  }
});
