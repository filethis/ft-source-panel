[Demo](https://filethis.github.io/ft-http-behavior/components/ft-http-behavior/demo/)    [API](https://filethis.github.io/ft-http-behavior/components/ft-http-behavior/)    [Repo](https://github.com/filethis/ft-http-behavior)

### \<ft-http-behavior\>

This behavior  provides "Promisified" HTTP requests. By default it expects JSON responses, which it deserializes, but this is configurable.

An example which gets the full list of all websites (sources) from which FileThis can fetch documents:

    getSources: function()
    {
        var url = this.server + this.apiPath +
            "/sources";
        var options = this._buildHttpOptions();
        return this.httpGet(url, options)
            .then(function(sources)
            {
                this.sources = sources;
            }.bind(this));
    },
