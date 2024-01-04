var w = c.width = window.innerWidth,
		h = c.height = window.innerHeight,
		ctx = c.getContext( '2d' ),
		
		hw = w / 2, // half-width
		hh = h / 2,
		
		opts = {
			strings: [ 'HAPPY', 'BIRTHDAY!' ],
			charSize: 30,
			charSpacing: 35,
			lineHeight: 40,
			
			cx: w / 2,
			cy: h / 2,
			
			fireworkPrevPoints: 10,
			fireworkBaseLineWidth: 5,
			fireworkAddedLineWidth: 8,
			fireworkSpawnTime: 200,
			fireworkBaseReachTime: 30,
			fireworkAddedReachTime: 30,
			fireworkCircleBaseSize: 20,
			fireworkCircleAddedSize: 10,
			fireworkCircleBaseTime: 30,
			fireworkCircleAddedTime: 30,
			fireworkCircleFadeBaseTime: 10,
			fireworkCircleFadeAddedTime: 5,
			fireworkBaseShards: 5,
			fireworkAddedShards: 5,
			fireworkShardPrevPoints: 3,
			fireworkShardBaseVel: 4,
			fireworkShardAddedVel: 2,
			fireworkShardBaseSize: 3,
			fireworkShardAddedSize: 3,
			gravity: .1,
			upFlow: -.1,
			letterContemplatingWaitTime: 360,
			balloonSpawnTime: 20,
			balloonBaseInflateTime: 10,
   balloonAddedInflateTime: 10,
			balloonBaseSize: 20,
			balloonAddedSize: 20,
			balloonBaseVel: .4,
			balloonAddedVel: .4,
			balloonBaseRadian: -( Math.PI / 2 - .5 ),
			balloonAddedRadian: -1,
		},
		calc = {
			totalWidth: opts.charSpacing * Math.max( opts.strings[0].length, opts.strings[1].length )
		},
		
		Tau = Math.PI * 2,
		TauQuarter = Tau / 4,
		
		letters = [];

ctx.font = opts.charSize + 'px Verdana';

function Letter( char, x, y ){
	this.char = char;
	this.x = x;
	this.y = y;
	
	this.dx = -ctx.measureText( char ).width / 2;
	this.dy = +opts.charSize / 2;
	
	this.fireworkDy = this.y - hh;
	
	var hue = x / calc.totalWidth * 360;
	
	this.color = 'hsl(hue,80%,50%)'.replace( 'hue', hue );
	this.lightAlphaColor = 'hsla(hue,80%,light%,alp)'.replace( 'hue', hue );
	this.lightColor = 'hsl(hue,80%,light%)'.replace( 'hue', hue );
	this.alphaColor = 'hsla(hue,80%,50%,alp)'.replace( 'hue', hue );
	
	this.reset();
}

				ctx.lineWidth = point[ 2 ] * lineWidthProportion * i;
				ctx.beginPath();
				ctx.moveTo( point[ 0 ], point[ 1 ] );
				ctx.lineTo( point2[ 0 ], point2[ 1 ] );
				ctx.stroke();
			
			}
			
			if( this.tick >= this.reachTime ){
				
				this.phase = 'contemplate';
				
				this.circleFinalSize = opts.fireworkCircleBaseSize + opts.fireworkCircleAddedSize * Math.random();
				this.circleCompleteTime = opts.fireworkCircleBaseTime + opts.fireworkCircleAddedTime * Math.random() |0;
				this.circleCreating = true;
				this.circleFading = false;
				
				this.circleFadeTime = opts.fireworkCircleFadeBaseTime + opts.fireworkCircleFadeAddedTime * Math.random() |0;
				this.tick = 0;
				this.tick2 = 0;
				
				this.shards = [];
				
				var shardCount = opts.fireworkBaseShards + opts.fireworkAddedShards * Math.random() |0,
						angle = Tau / shardCount,
						cos = Math.cos( angle ),
						sin = Math.sin( angle ),
						
						x = 1,
						y = 0;
				
				for( var i = 0; i < shardCount; ++i ){
					var x1 = x;
					x = x * cos - y * sin;
					y = y * cos + x1 * sin;
					
					this.shards.push( new Shard( this.x, this.y, x, y, this.alphaColor ) );
				}
			}
			
		}
	} else if( this.phase === 'contemplate' ){
		
		++this.tick;
		
		if( this.circleCreating ){
			
			++this.tick2;
			var proportion = this.tick2 / this.circleCompleteTime,
					armonic = -Math.cos( proportion * Math.PI ) / 2 + .5;

			ctx.fillStyle = this.color;
			ctx.beginPath();
			generateBalloonPath( this.cx, this.cy, this.size );
			ctx.fill();
			
			ctx.beginPath();
			ctx.moveTo( this.cx, this.cy );
			ctx.lineTo( this.cx, this.cy + this.size );
			ctx.stroke();
			
			ctx.fillStyle = this.lightColor.replace( 'light', 70 );
			ctx.fillText( this.char, this.cx + this.dx, this.cy + this.dy + this.size );
			
			if( this.cy + this.size < -hh || this.cx < -hw || this.cy > hw  )
				this.phase = 'done';
			
		}
	}
}
function Shard( x, y, vx, vy, color ){
	
	var vel = opts.fireworkShardBaseVel + opts.fireworkShardAddedVel * Math.random();
	
	this.vx = vx * vel;
	this.vy = vy * vel;
	
	this.x = x;
	this.y = y;
	
	this.prevPoints = [ [ x, y ] ];
	this.color = color;
	
	this.alive = true;
	
	this.size = opts.fireworkShardBaseSize + opts.fireworkShardAddedSize * Math.random();
}
Shard.prototype.step = function(){
	
	this.x += this.vx;
	this.y += this.vy += opts.gravity;

	
	window.requestAnimationFrame( anim );
	
	ctx.fillStyle = '#111';
	ctx.fillRect( 0, 0, w, h );
	
	ctx.translate( hw, hh );
	
	var done = true;
	for( var l = 0; l < letters.length; ++l ){
		
		letters[ l ].step();
		if( letters[ l ].phase !== 'done' )
			done = false;
	}
	
	ctx.translate( -hw, -hh );
	
	if( done )
		for( var l = 0; l < letters.length; ++l )
			letters[ l ].reset();
}

for( var i = 0; i < opts.strings.length; ++i ){
	for( var j = 0; j < opts.strings[ i ].length; ++j ){
		letters.push( new Letter( opts.strings[ i ][ j ], 
														j * opts.charSpacing + opts.charSpacing / 2 - opts.strings[ i ].length * opts.charSize / 2,
														i * opts.lineHeight + opts.lineHeight / 2 - opts.strings.length * opts.lineHeight / 2 ) );
	}
}

anim();

window.addEventListener( 'resize', function(){
	
	w = c.width = window.innerWidth;
	h = c.height = window.innerHeight;
	
	hw = w / 2;
	hh = h / 2;
	
	ctx.font = opts.charSize + 'px Verdana';
})
