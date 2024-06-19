# CookieCode Custom Templates

This repository contains example templates for the CookieCode banner and settings dialog.

## Requirements
- NPM

## Installation
1. Pull this repository to the local machine
2. From the root folder run `npm install`

## Build
From the root folder run `npm run build`.
The output will be placed in the `dist` folder.

## Usage
First place the `default.html` file from the required template in a location that can be reached online.

Then, in the CookieCode script of the website, add extra configuration by adding an additional script tag above the regular CookieCode script like this:

```
<script type="application/json;cc-config">
{
    "banner": {
        "template": "https://cdn.cookiecode.nl/template/banner-popup/default.html"
    },
    "dialog": {
        "template": "https://cdn.cookiecode.nl/template/dialog-simple/default.html"
    }
}
</script>
```

Here replace the template urls with links to the custom `default.html` that was placed online in the first step.

It's possible to use only a custom banner or only a custom dialog. They don't both need to use a custom template.

NB: The script above uses whitespace for readability, but can be minified.