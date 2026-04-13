// Stub for react-native-maps on web
const React = require("react");
const { View } = require("react-native");

function MapView(props) {
  return React.createElement(View, { style: props.style, testID: props.testID });
}

MapView.Animated = MapView;

function Marker() {
  return null;
}

function Callout() {
  return null;
}

function Polygon() {
  return null;
}

function Polyline() {
  return null;
}

function Circle() {
  return null;
}

const PROVIDER_GOOGLE = "google";
const PROVIDER_DEFAULT = null;

module.exports = MapView;
module.exports.default = MapView;
module.exports.MapView = MapView;
module.exports.Marker = Marker;
module.exports.Callout = Callout;
module.exports.Polygon = Polygon;
module.exports.Polyline = Polyline;
module.exports.Circle = Circle;
module.exports.PROVIDER_GOOGLE = PROVIDER_GOOGLE;
module.exports.PROVIDER_DEFAULT = PROVIDER_DEFAULT;
