//Sprite.js extracts correct sprite from a sprite sheet and draws to canvas

(function() {
    function Sprite(url, pos, size, speed, frames, dir, once, boxSize, boxOffset) {
        this.pos = pos; //coordinates (x,y) in sprite sheet
        this.size = size; //size of keyframe (expect frames to be 'size' distance apart)
        this.speed = typeof speed === 'number' ? speed : 0;  //frames per second for animation
        this.frames = frames; //Array containing sequence to display sprite frames in
        this._index = 0;
        this.url = url; //sprite sheet location
        this.dir = dir || 'horizontal'; //Direction to find next frame on sprite sheet
        this.once = once;  //run animation once boolean value
        this.boxSize = boxSize || size; //hit box if passed, else sprite size
        this.boxOffset = boxOffset || [0,0]; //hit box offset if passed, else 0
    };


    Sprite.prototype = {
        
        //Based on time since last animation, set index of frame to display       
        update: function(dt) {
            this._index += this.speed*dt; //Animation speed * time since update
        },

        //Draw frame to canvas ctx
        render: function(ctx) {
            var frame;

            if(this.speed > 0) {  //If animated
                var max = this.frames.length; //frames in animation
                var idx = Math.floor(this._index);  //round index down 
                frame = this.frames[idx % max]; //select appropriate frame in animation

                if(this.once && idx >= max) {  //for run once animations: ran once, animation complete
                    this.done = true;
                    return;
                }
            } else { //Animation speed is zero
                frame = 0;
            } //End animation speed if

            //Extract sprite animation position coordinates
            var x = this.pos[0];
            var y = this.pos[1];

            //Move to current frame location in sprite sheet
            if(this.dir == 'vertical') { //Movement type vertical
                y += frame * this.size[1];  //move # frames * frame height
            } else { //Movement type (not vertical)
                x += frame * this.size[0]; //move # frames * frame width
            }

            //Draw image to ctx canvas
            ctx.drawImage(resources.get(this.url),  //get sprite sheet
                          x, y, //source image x,y
                          this.size[0], this.size[1], //source image w, h
                          0, 0, //destination image x,y
                          this.size[0], this.size[1]); //destination image w,h
        }//End draw frame to canvas
    }; //End Sprite.prototype

    window.Sprite = Sprite;
})();