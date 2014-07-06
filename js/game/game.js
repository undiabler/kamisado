/**
 * @author Undiabler   Undiabler@gmail.com
 * http://www.rainbowcore.it
 */

function colormove_next(id,who){
	var color_names=['оранжевые','красные','зеленые','розовые','желтые','синие','светлые','коричневые'];
	var colors=['orange','red','green','pink','yellow','blue','lightblue','brown'];
	$('#colorname').html(color_names[id-1]);
	$('#colormove').css('background-color',colors[id-1]);
	$('#nextmove').html(who?'Ваш ход':'Ход противника');
}

function winorlose(win,twin){
	if (win) $('.playtext').html('Вы победили!<br/>Играть еще!'); else $('.playtext').html('Вы проиграли =(<br/>Играть еще!');
	if (twin) $('.playtext').html('Вы победили!<br/>(противник отключился)<br/>Играть еще!');
		$('#playbutton').show();
		$('#waitmessage').hide();
		$('#errormessage').hide();
		$('.fillzone').fadeIn(500);
	$('#colorname').html('');
	$('#colormove').css('background-color','');
	$('#nextmove').html('');
}

function SimpleGame(){
		window.game=this;

		this.move=function(start,end){
			start=start.split(':');
			end=end.split(':');

			this.send(JSON.stringify({code:2,data:{x1:start[0],y1:start[1],x2:end[0],y2:end[1]}}));
			
		}

		this.socket = new WebSocket("ws://localhost:8081");

		this.socket.onmessage = function(event) {
		  var data = JSON.parse(event.data);
		  console.log(data);
		  	switch (data.code){
		  		case 1: updateusers(data.data); break;
		  		case 2: $('.fillzone').fadeOut(500); spawndishki(data.data=='black'); break;
		  		case 3: movefishka(data.data.x1,data.data.y1,data.data.x2,data.data.y2);colormove_next(data.data.color,data.data.move); break;
		  		case 4: winorlose(data.data.winner,data.data.wo); break;
		  	}
		};

		this.socket.onclose = this.socket.onerror = function(event) {
			// alert('error');
		  $('#playbutton').hide();
		  $('#waitmessage').hide();
		  $('#errormessage').show();
		  $('.fillzone').fadeIn(500);
		  updateusers(0);
		};

		this.socket.onopen = function(event) {
		  $('#playbutton').show();
		  $('#waitmessage').hide();
		  $('#errormessage').hide();
		  $('.fillzone').fadeIn(500);
		};

		this.send=function(e){this.socket.send(e);}


}


function updateusers(num){
	$('#calcusers').html(num);
}

function spawndishki(youblack){
	window.youblack=youblack;
	$('#colorname').html('любой цвет');
	$('#colormove').css('background-color','');
	$('#nextmove').html(youblack?'Ваш ход':'Ход противника');
	$('.fishka').remove();
	$('.gameboard tr').eq(0).children('td').each(function(e){
		$(this).html('<div id="en'+e+'" class="fishka" style="background: url(\'img/fishki.png\') no-repeat -'+e*80+'px -'+((youblack!=undefined && youblack==true)?0:80)+'px" ></div>');
	});
	$('.gameboard tr').eq(7).children('td').each(function(e){
		$(this).html('<div id="pl'+(7-e)+'" class="fishka" style="background: url(\'img/fishki.png\') no-repeat -'+(7-e)*80+'px -'+((youblack!=undefined && youblack==true)?80:0)+'px" ></div>');
	});
}

function movefishka(x1,y1,x2,y2){
	var result=[];
	result[0]=x1-x2;
	result[1]=y1-y2;

	var fishkamove=$('.gameboard tr td').eq( 8*(7-1*y1)+1*x1 ).children('.fishka').eq(0);
	if (fishkamove.length==0) return alert('в поле нет фишки!');

	console.log(x2+":"+y2);

	var newpos={x:fishkamove.offset().left-$('.gamefolder').offset().left,y:fishkamove.offset().top-$('.gamefolder').offset().top};
		fishkamove.css('position','absolute');
		fishkamove.css('z-index','5');
		fishkamove.css('left',newpos.x);
		fishkamove.css('top',newpos.y);
		var rxy=8*(7-1*y2) + (1*x2);

		var anim=$('.fishka').width();
		// console.log(result[0],result[1]);
	fishkamove.animate({
    left: newpos.x-result[0]*anim,
    top: newpos.y+result[1]*anim,
  }, 500, function() {
    	var moveme_c = fishkamove.detach();
  		moveme_c.appendTo($('.gameboard tr td').eq(rxy));
  		moveme_c.css('position','static');
		moveme_c.css('left',0);
		moveme_c.css('top',0);
  });
	
}
































 