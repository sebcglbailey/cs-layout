import Sketch from 'sketch'

let bottom = 0, margin = 0;

let lastLayerIsText = false;
let baselineOffset = 0;

const capHeightRatio = 0.7
const baselineOffsetRatio = 0.17
const capHeightOffsetRatio = 0.13

// Run the plugin
export default (context) => {
  let doc = Sketch.fromNative(context.document)
  let layers = doc ? doc.selectedLayers : null
  layers = layers ? layers.layers : null

  // is the seletion an artboard?
  const isArtboard = layers && layers[0] && layers[0].type && layers[0].type == "Artboard" ? true : false

  if (!isArtboard) {
    Sketch.UI.message("Please select an artboard")
    return
  }

  // get the artboards layers
  const artboard = layers[0]
  layers = artboard.layers
  
  iterateLayers(layers)

  // artboard.adjustToFit()
  
}


// iterate over given array of layers
const iterateLayers = (layers) => {

  layers.reverse()

  let i = 0

  while (i < layers.length) {

    let layer = layers[i]

    setMargin(layer)
    checkIfTop(layer)
    place(layer)
    
    let isGroup = checkIfGroup(layer)
    
    if (isGroup) {
      setDefaults()
      let groupLayers = layer.layers
      iterateLayers(groupLayers)
      layer.adjustToFit()
    }

    if (checkIfText(layer)) {
      lastLayerIsText = true
    } else if (checkIfGroup(layer)) {
      lastLayerIsText = lastLayerIsText
    } else {
      lastLayerIsText = false
    }

    setBottom(layer, lastLayerIsText)
    
    i++

  }

  layers.reverse()

}

const roundToNearest = (value, near) => {
  if (value % near < 1) {
    return value + (near - (value % near)) - near
  } else {
    return value + (near - (value % near))
  }
}

// setting the margin value
const setMargin = (layer) => {
  margin = getMargin(layer.name)
}

const getMargin = (name) => {
  let marginString = name.split("[margin:")[1]
  marginString = marginString ? marginString.split("]")[0] : null
  return Number(marginString) ? Number(marginString) : 0
}

// setting the bottom value
const setBottom = (layer, isText) => {

  bottom = layer.frame.y + layer.frame.height

  if (checkIfText(layer)) {
    let capHeightOffset = getCapHeightOffset(layer)
    let fontSize = layer.style.fontSize
    let capHeight = fontSize * capHeightRatio
    let baseline = capHeightOffset + capHeight
    baselineOffset = layer.style.lineHeight - Math.round(baseline)
  } else if (isText) {
    baselineOffset = baselineOffset
  } else {
    bottom = layer.frame.y + layer.frame.height
    baselineOffset = 0;
  }

}

const getCapHeightOffset = (layer) => {
  let offset;

  let fontSize = layer.style.fontSize
  let lineHeight = layer.style.lineHeight

  let diff = lineHeight - fontSize
  if (diff%2 == 0) {
    offset = diff/2
  } else {
    offset = (diff+1)/2
  }

  offset += fontSize * capHeightOffsetRatio

  return offset

}


// place the layer based on current position and margin
const place = (layer) => {
  let position = bottom + margin

  if (layer.type == "Text") {
    position -= getCapHeightOffset(layer)
  }

  layer.frame.y = Math.round(position) - baselineOffset

  if (layer.type == "Text") {
    let capHeightOffset = getCapHeightOffset(layer)
    let fontSize = layer.style.fontSize
    let capHeight = fontSize * capHeightRatio
  
    let position = layer.frame.y
    let baseline = layer.frame.y + capHeightOffset + capHeight

    if (baseline%4 < 1.2) {
      layer.frame.y = Math.round(position - baseline%4)
    } else {
      layer.frame.y = Math.round(position + (4 - baseline%4))
    }
  }

  baselineOffset = 0;

}

// check if the layer is a group
const checkIfGroup = (layer) => {
  return layer.type == "Group"
}

const checkIfText = (layer) => {
  return layer.type == "Text"
}

// reset the position and margin to default (0)
const setDefaults = () => {
  bottom = 0;
  margin = 0;
}

// checks to see if the layer has is stuck to the top of its group
const checkIfTop = (layer) => {
  if (layer.name && layer.name.includes("[top]")) {
    bottom = 0;
    baselineOffset = 0;
  }
}