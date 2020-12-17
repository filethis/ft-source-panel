[Demo](https://filethis.github.io/ft-confirmation-dialog/components/ft-confirmation-dialog/demo/)    [API](https://filethis.github.io/ft-confirmation-dialog/components/ft-confirmation-dialog/)    [Repo](https://github.com/filethis/ft-confirmation-dialog)

### \<ft-confirmation-dialog\>

-----------------------------------------------------------

An element that provides a configurable alert or confirmation dialog that returns a Promise when invoked.

Unlike the browser's built-in _alert()_ function, which is synchronous and blocks execution, this element has _alert()_ and _confirm()_ methods that are asynchronous. The _confirm()_ method returns a Promise instance when invoked. The Promise resolves to to a string that is either "cancel" or "commit". 

When you've defined an element in your scope:

    <ft-confirmation-dialog id="confirmationDialog"></ft-confirmation-dialog>

you can use _alert()_ like this:

    _onIsThisSafe: function(event)
    {
        this.$.confirmationDialog.alert("We use bank-level encryption.");
    },

and use _confirm()_ like this

    var prompt = "Are you sure you want to delete the selected document?";
    return this.$.confirmationDialog.confirm(prompt, "Delete Document")
        .then(function(choice)
        {
            if (choice === "cancel")
                return;
            this.fire('delete', this.selectedDocument);
        }.bind(this))

