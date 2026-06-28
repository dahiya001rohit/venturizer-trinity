const React = require('react');
const { renderToString } = require('react-dom/server');
require('@babel/register')({
  presets: ['@babel/preset-env', ['@babel/preset-react', {runtime: 'automatic'}]]
});
const { Settings } = require('./src/dashboard/Settings.jsx');
try {
  console.log("Rendering...");
  const html = renderToString(React.createElement(Settings));
  console.log("Success");
} catch(e) {
  console.error("Error:", e);
}
