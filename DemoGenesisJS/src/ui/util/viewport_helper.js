// helper class for dragging/zooming operation for layer
// require the layer has a member variable named 'contentNode'
// all this class doing is to manipulate the 'contentNode' 

require('base/math.js');
require('base/underscore.js');

(function () {

  // ------------------ private functions below------------------
  var __this;
  var __private = {
    eActionMode: {
      NONE: 0,
      DRAG: 1,
      ZOOM: 2,
      NAVIGATION: 3,
    },
    scaleLimit: {
      min_actual: 0.6,
      min: 0.4,
      max_actual: 3,
      max: 4,
    },
    state: {},
    speed: 0,
    updatePosition: function (newPosition) {
      newPosition = gu.math.p.setInRect(newPosition, this.boundary);

      // update new position
      this.target.setPosition(newPosition);
    },

    // update boundary that target can move around
    updateBoundary: function (newScale) {
      'use strict';
      var expand = newScale / this.originScale;
      var actualSize = cc.size(this.targetSize.width * expand, this.targetSize.height * expand);
      var boundary = cc.rect(
        cc.winSize.width - actualSize.width,
        cc.winSize.height - actualSize.height,
        actualSize.width - cc.winSize.width,
        actualSize.height - cc.winSize.height);

      this.boundary = boundary;
    },
    // update target scale
    updateScale: function (newScale) {
      'use strict';
      var oldScale = this.target.scale;
      this.target.scale = newScale;

      // update boundary after scaling
      this.updateBoundary(newScale);

      // calculate new position
      var oldPosition = this.target.getPosition();
      var newPosition = cc.p(this.zoomPosition.x - this.zoomCenter.x * newScale,
        this.zoomPosition.y - this.zoomCenter.y * newScale);

      // set new positioin
      this.updatePosition(newPosition);
    },
    doInetialDrag: function (delta) {
      'use strict';
      // if the speed is very low, exit
      if (gu.math.p.lessThan(this.speed, 10.0)) {
        this.mode = this.eActionMode.NONE;
        return;
      }
      // update new position
      var offset = gu.math.p.mul(this.speed, delta);
      var newPosition = gu.math.p.add(this.target.getPosition(), offset);
      newPosition = gu.math.p.setInRect(newPosition, this.boundary);
      this.target.setPosition(newPosition);

      // decrease speed by 15% 
      this.speed = gu.math.p.minus(this.speed, gu.math.p.mul(this.speed, 0.15));
    },
    doInetialZoom: function (delta) {
      'use strict';
      if (Math.abs(this.target.scale - this.scaleLimit.max_actual) < 0.1 ||
        Math.abs(this.target.scale - this.scaleLimit.min_actual) < 0.1) {
        this.mode = this.eActionMode.NONE;
        return;
      }

      var newScale = this.target.scale + this.scaleSpeed;
      this.updateScale(newScale);
    },
    doDrag: function (delta) {
      'use strict';
      var oldPosition = this.target.getPosition();

      // calculate new position offset
      var newPosition = cc.p(this.posStart.x + this.touchTo.x - this.touchOrigin.x, this.posStart.y + this.touchTo.y - this.touchOrigin.y);
      this.updatePosition(newPosition);

      // calculate moving speed
      this.speed = gu.math.p.mul(gu.math.p.minus(newPosition, oldPosition), 1 / delta);
    },
    doZoom: function (delta) {
      'use strict';
      // calculate new scale
      var newScale = this.scaleStart * (this.touchDistanceTo / this.touchDistanceOrigin);
      newScale = this.validateScaleBoundary(newScale);

      this.updateScale(newScale, this.zoomCenter);
    },
    doNavigate: function (delta) {
      this.to.duration -= delta;
      var stop = this.to.duration <= 0;
      var oldScale = this.target.scale;
      var offsetScale = (this.to.scale - oldScale) * 0.3;
      this.target.scale = stop ? this.to.scale : oldScale + offsetScale;
      this.updateBoundary(this.target.scale);

      var oldPosition = this.target.getPosition();

      // calculate new position offset
      var offset = cc.p((this.to.position.x - oldPosition.x) * 0.3, (this.to.position.y - oldPosition.y) * 0.3);
      var newPosition = stop ? this.to.position : cc.p(oldPosition.x + offset.x, oldPosition.y + offset.y);
      this.updatePosition(newPosition);

      if (stop) {
        this.mode = this.eActionMode.NONE;
      }
    },
    // make sure the scale not out of range
    validateScaleBoundary: function (scale) {
      'use strict';
      if (scale > this.scaleLimit.max) { scale = this.scaleLimit.max; } // max scale
      if (scale < this.scaleLimit.min) { scale = this.scaleLimit.min; } // min scale

      return scale;
    },
    stopCurrentAction: function () {
      'use strict';
      switch (this.mode) {
        case this.eActionMode.NONE: return;
        case this.eActionMode.navigationDuraton: return;
        case this.eActionMode.DRAG: break;
        case this.eActionMode.ZOOM:
          if (this.target.scale > this.scaleLimit.max_actual) {
            this.updateScale(this.scaleLimit.max_actual);
          }
          if (this.target.scale < this.scaleLimit.min_actual) {
            this.updateScale(this.scaleLimit.min_actual);
          }
          break;
        default: break;
      }
      this.mode = this.eActionMode.NONE;
    },
    // initializer
    init: function (layer, layerSize) {
      gu.debug.assert(layerSize && layerSize.width && layerSize.height, 'layerSize is invalid in ViewportHelper.init()');

      this.eventTarget = layer;
      this.target = layer.controls.contentNode;
      this.targetSize = layerSize;
      this.originScale = this.target.scale;
      this.updateBoundary(this.originScale);
      this.mode = this.eActionMode.NONE;

      this.scaleLimit.min_actual = Math.max(cc.winSize.width / layerSize.width, cc.winSize.height / layerSize.height) * 1.25;
      this.scaleLimit.min = this.scaleLimit.min_actual * 0.8;
    },
    // multi-touch event handler - began
    onTouchesBegan: function (touches, event) {
      'use strict';
      if (this.mode == this.eActionMode.NAVIGATION) { return; }

      this.mode = touches.length == 1 ? this.eActionMode.DRAG : this.eActionMode.ZOOM;
      this.touching = true;

      // record origin touch position
      this.touchOrigin = touches[0].getLocation();
      this.touchTo = this.touchOrigin;

      // record origin target position
      this.posStart = this.target.getPosition();

      if (this.mode === this.eActionMode.ZOOM) {
        // record origin scale of target
        this.scaleStart = this.target.scale;

        // record touch origin distance (of first 2 Touch points)
        var
          pos1 = touches[1].getLocation(),
          pos0 = touches[0].getLocation();

        this.touchDistanceOrigin = gu.math.p.distance(pos1, pos0);
        this.zoomPosition = cc.p((pos1.x + pos0.x) * 0.5, (pos1.y + pos0.y) * 0.5);
        this.zoomCenter = cc.p((this.zoomPosition.x - this.posStart.x) / this.scaleStart,
          (this.zoomPosition.y - this.posStart.y) / this.scaleStart);
        this.touchDistanceTo = this.touchDistanceOrigin;
      }
    },
    // multi-touch event handler - moved
    onTouchesMoved: function (touches, event) {
      'use strict';

      switch (this.mode) {
        case this.eActionMode.NONE: return;
        case this.eActionMode.DRAG:
          this.touchTo = touches[0].getLocation();
          break;
        case this.eActionMode.ZOOM:
          if (touches.length < 2) { return; }
          this.touchDistanceTo = gu.math.p.distance(touches[1].getLocation(), touches[0].getLocation());
          break;
        default: break;
      }
    },
    // multi-touch event handler - end
    onTouchesEnded: function (touches) {
      'use strict';

      switch (this.mode) {
        case this.eActionMode.NONE: return;
        case this.eActionMode.navigationDuraton: return;
        case this.eActionMode.DRAG: break;
        case this.eActionMode.ZOOM:
          this.scaleSpeed = 0;
          if (this.target.scale > this.scaleLimit.max_actual) {
            this.scaleSpeed = (this.scaleLimit.max_actual - this.target.scale) * 0.1;
          }
          if (this.target.scale < this.scaleLimit.min_actual) {
            this.scaleSpeed = (this.scaleLimit.min_actual - this.target.scale) * 0.1;
          }
          break;
        default: break;
      }
      this.touching = false;
    },
    focus: function (originRect, toRect) {
      this.stopCurrentAction();

      if (!toRect) {
        toRect = cc.rect(cc.winSize.width * 0.25, cc.winSize.height * 0.4, cc.winSize.width * 0.5, cc.winSize.height * 0.2);
      }

      var scale = toRect.height / originRect.height;
      var currentMid = gu.math.rect.mid(originRect);
      var toMid = gu.math.rect.mid(toRect);
      var position = cc.p(toMid.x - currentMid.x * scale,
        toMid.y - currentMid.y * scale);
      this.to = { duration: 1.0, scale: scale, position: position };
      this.mode = this.eActionMode.NAVIGATION;
    },
    save: function () {
      this.state.scale = this.target.scale;
      this.state.position = this.target.getPosition();
    },
    restore: function (duration) {
      duration = _.isFinite(duration) ? duration : 0;
      this.to = { duration: duration || 0, scale: this.state.scale, position: this.state.position };
      this.mode = this.eActionMode.NAVIGATION;
    },

    // schedular update event handler
    update: function (delta) {
      'use strict';

      var nothing; // to emininate format warning
      switch (this.mode) {
        case this.eActionMode.NONE: return;
        case this.eActionMode.NAVIGATION:
          this.doNavigate(delta);
          break;
        case this.eActionMode.DRAG:
          nothing = this.touching ? this.doDrag(delta) : this.doInetialDrag(delta);
          break;
        case this.eActionMode.ZOOM:
          nothing = this.touching ? this.doZoom(delta) : this.doInetialZoom(delta);
          break;
        default: break;
      }

      if (__this.onUpdate) { __this.onUpdate(this.eventTarget); }
    }
  };
  // ------------------ private functions above ------------------

  gu.ui.ViewportHelper = cc.Class.extend({
    // expose to caller to define behavior each time viewport is updated.    
    onUpdate: null,
    // initializer
    init: function (layer, layerSize) {
      __this = this;
      __private.init(layer, layerSize);
    },
    // multi-touch event handler - began
    onTouchesBegan: function (touches, event) { __private.onTouchesBegan(touches, event); },
    // multi-touch event handler - moved
    onTouchesMoved: function (touches, event) { __private.onTouchesMoved(touches, event); },
    // multi-touch event handler - end
    onTouchesEnded: function (touches, event) { __private.onTouchesEnded(touches, event); },
    // change viewport to focus on place
    focus: function (originRect, toRect) { __private.focus(originRect, toRect); },
    // save viewport
    save: function () { __private.save(); },
    // restore viewport
    restore: function (duration) { __private.restore(duration); },
    // expose to view to be driven with scheduler 
    update: function (delta) { __private.update(delta); }
  });

} ());

