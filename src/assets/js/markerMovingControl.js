import _ from 'underscore'

let MarkerMovingControl = function(map, marker, path,speed) {
  this._map = map;
  this._speed = speed;
  this._marker = marker;
  this._path = path;
  this._currentIndex = 0;
  marker.setMap(map);
  marker.setPosition(path[0]);
}

MarkerMovingControl.prototype.step = function(){
  let nextIndex = this._currentIndex + 2;


  if (nextIndex < this._path.length) {
    if (!this._listenToMoveend) {
      this._listenToMoveend = AMap.event.addListener(this._marker, 'moveend', function(){
        this._currentIndex++;
        AMap.event.trigger(this, 'stepend');
      }, this);
    }
    // console.log(nextIndex);
    if(this._path[nextIndex].lng == this._path[this._currentIndex].lng && this._path[nextIndex].lat == this._path[this._currentIndex].lat ) {
      this._currentIndex++;
      this.step();
      return;
    }else{
      this._marker.moveTo(this._path[nextIndex], this._speed);
    }
  }
  return this._currentIndex;
};

/**
 * 移动marker，会从当前位置开始向前移动
 */
MarkerMovingControl.prototype.move = function() {
  if (!this._listenToStepend) {
    this._listenToStepend = AMap.event.addListener(this, 'stepend', function() {
      this.step();
    }, this);
  }
  this.step();
  return this._currentIndex;
};
/**
 * 停止移动marker，由于控件会记录当前位置，所以相当于暂停
 */
MarkerMovingControl.prototype.stop = function() {
  this._marker.stopMove();
};

/**
 * 重新开始，会把marker移动到路径的起点然后开始移动
 */
MarkerMovingControl.prototype.restart = function() {
  this._speed=1000;
  this.stop();
  this._marker.setPosition(this._path[0]);
  this._currentIndex = 0;
  this.move();
};
/**
 * 加速
 */
MarkerMovingControl.prototype.speed = function(speed) {
  this._speed = speed * 200;
  this.move();
};

/**
 * 拖拽或点击后的车辆位置
 */
MarkerMovingControl.prototype.jingdu = function(ind) {
  // this.stop();
  this._currentIndex = ind;
};
export default MarkerMovingControl
