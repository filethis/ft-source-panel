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
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import 'ft-confirmation-dialog/ft-confirmation-dialog.js';

import '@polymer/polymer/polymer-legacy.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<template>

    <!-- Confirmation dialog -->
    <ft-confirmation-dialog id="confirmationDialog"></ft-confirmation-dialog>

</template>`;

document.head.appendChild($_documentContainer.content);

// Make sure the "FileThis" namespace exists
window.FileThis = window.FileThis || {};

/**
 * `<ft-error-behavior>`
 *
 * The behavior provides support for error handling and reporting.
 *
 * @demo
 * @polymerBehavior FileThis.ErrorBehavior
 */
FileThis.ErrorBehavior = {

    properties: {

        /** Set true if you want alert dialog windows to come up when errors occur. */
         errorDebug: {
            type: Boolean,
            value: true
        }
    },

    ready: function()
    {
        window.addEventListener("error", this._onWindowError.bind(this));
    },

    _onWindowError: function(message, url, lineNumber, columnNumber, errorObject)
    {
        var messageArgumentType = typeof message;
        if (messageArgumentType === "object")  // Eg. ErrorEvent
        {
            if (!!message.filename)
                url = message.filename;
            if (!!message.lineno)
                lineNumber = message.lineno;
            if (!!message.colno)
                columnNumber = message.colno;
            if (!!message.message)
                message = message.message;
        }
        else if (messageArgumentType !== "string")
        {
            // Stringify it, whatever it is...
            message = message.toString();
        }

        // When error occurs in a script loaded from another origin, we get a very limited message
        var isCrossOriginError = (message.toLowerCase().indexOf("script error") > -1);
        if (isCrossOriginError)
        {
            console.log("Error occurred in a script loaded from another domain.");
            return false;
        }

        var error = this.createErrorFromValues(message, url, lineNumber, columnNumber, errorObject);

        this.handleCaughtError(error);

        return false;
    },

    /**
     * Call this method with the caught error to write a nice message to the console and, if the debug mode is on,
     * to pose a dialog with the same message.
     *
     * @param {Object} reason The error that was caught.
     */
    handleCaughtError: function(reason)
    {
        var message = this._createMessageFromError(reason);
        console.log(message);
        if (this.errorDebug)
            alert(message);
//                this.$.confirmationDialog.alert(message);
    },

    _createMessageFromError: function(error)
    {
        // If the error is not an Error class instance, return a message that renders it as a string
        var errorType = typeof error;
        if (errorType !== 'object')
            return "Error of type " + errorType + ": " + error.toString();

        var message = "An error occurred\n";
        message +=    "-----------------\n\n";

        message += "---------------------------------\n\n";

        // The standard properties
        message = this._appendErrorPropertyTo(error, 'name', "Name", message);
        message = this._appendErrorPropertyTo(error, 'message', "Message", message);

        // File properties (can come from window.onerror() and XMLHttpRequest.onError())
        message = this._appendErrorPropertyTo(error, 'filename', "Filename", message);
        message = this._appendErrorInlineCodePropertyTo(error, 'url', "URL", message);
        message = this._appendErrorPropertyTo(error, 'lineNumber', "Line", message);
        message = this._appendErrorPropertyTo(error, 'columnNumber', "Column", message);

        // System error properties
        message = this._appendErrorPropertyTo(error, 'code', "Code", message);
        message = this._appendErrorPropertyTo(error, 'errno', "errno", message);
        message = this._appendErrorPropertyTo(error, 'syscall', "syscall", message);
        message = this._appendErrorInlineCodePropertyTo(error, 'path', "Path", message);
        message = this._appendErrorPropertyTo(error, 'port', "Port", message);

        // Stack property
        message = this._appendErrorStackPropertyTo(error, message);

        return message;
    },

    _appendErrorPropertyTo: function(error, name, label, message)
    {
        if (!error.hasOwnProperty(name))
            return message;

        var value = error[name].toString();
        return message + "**" + label + "**: " + value + "\n\n";
    },

    _appendErrorInlineCodePropertyTo: function(error, name, label, message)
    {
        if (!error.hasOwnProperty(name))
            return message;

        var value = error[name].toString();
        return message + "**" + label + "**: `" + value + "`\n\n";
    },

    _appendErrorStackPropertyTo: function(error, message)
    {
        // It seems that sometimes the "stack" property just contains another copy of the "message" property.
        // When it does, we ignore it.

        if (!error.hasOwnProperty("stack"))
            return message;

        var stack  = error["stack"].toString();

        if (error.hasOwnProperty("message"))
        {
            var originalMessage = error["message"].toString();
            if (stack === originalMessage)
                return message;
        }

        message += "**Stacktrace**:\n\n```" + stack + "```";

        return message;
    },

    /**
     * Call this method with the parameters you get from things like the XMLHttpRequest onerror() callback to turn
     * it into a standard "Error" instance. Different browsers provide different data in different contexts,
     * and any of the given parameters are allowed to have null values.
     *
     * @param {String} message The error message.
     * @param {String} url The url of the error.
     * @param {String} lineNumber The line number in the source code where the error occurred.
     * @param {String} columnNumber The column number in the source code where the error occurred.
     * @param {Object} errorObject The error object.
     */
    createErrorFromValues: function(message, url, lineNumber, columnNumber, errorObject)
    {
        var error = new Error();
        if (!!message)
            error.message = message;
        if (!!url)
            error.url = url;
        if (!!lineNumber)
            error.lineNumber = lineNumber;
        if (!!columnNumber)
            error.columnNumber = columnNumber;
        if (!!errorObject)
            error.errorObject = errorObject;
        return error;
    }
}
