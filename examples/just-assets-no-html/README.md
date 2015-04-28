Simple, no-hmtl configuration

All you have to do is serve HTML *somehow* that includes the following script tag.

```html
<script src="/app.js"></script>
```

As long as your `isDev` is true styles and JS will also be hotloaded if possible. Try running `npm start` in this folder then opening localhost:3000/something.html

Running `npm run build` will produce a `public` directory with just minified JS and CSS assets.
