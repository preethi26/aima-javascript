
function getdata(){
	var dataset = {

	examples : [ [1,1,0,0,1,2,3,0,1,2,1] , [0,1,0,0,1,3,1,0,0,4,3] , [1,0,1,0,0,2,1,0,0,1,1] , [1,1,0,1,1,3,1,1,0,4,2] , [0,1,0,1,0,3,3,0,1,2,4] , [1,0,1,0,1,2,2,1,1,3,1] , [0,0,1,0,0,1,1,1,0,1,1] , [1,0,0,0,1,2,2,1,1,4,1] , [0,0,1,1,0,3,1,1,0,1,4] , [0,1,1,1,1,3,3,0,1,3,2] , [0,0,0,0,0,1,1,0,0,4,1] , [1,1,1,1,1,3,1,0,0,1,4]  ],
	attrs : [0,1,2,3,4,5,6,7,8,9,10],
	attributes : ["target", "one", "two","three","four","five","six","seven","eight","nine","ten"],
	target : 0 ,
	values : [[0,1],[0,1],[0,1],[0,1],[0,1],[1,2,3],[1,2,3],[0,1],[0,1],[1,2,3,4], [1,2,3,4]]
	}
	return dataset;
}




$(document).ready(function(){
	var dataset = {};
    var currentExamples = [];
	var currentAttributes =  [];
	 var attrIndex = null;
	function init(){
		dataset = getdata();
		currentAttributes = getdata().attrs;
		currentExamples = getdata().examples;
		canvas1 = document.getElementById('decisionTreeLearningCanvas');
		canvas2 = document.getElementById('decisionTreeCanvas')
		visCurrentData = new drawExamples(canvas1,400,400,currentAttributes,currentExamples);
		visTree = new drawTree(canvas2,400,400,currentAttributes,currentExamples,dataset);
		
		visCurrentData.clickHandler = function(){
			index = $(this).attr('Index');
			if(attrIndex === index){
				console.log("index"+index)
				visTree.classify(index );
			}
		};
		visTree.clickHandler = function(){
			attrIndex = $(this).attr('attrIndex');
			visCurrentData.init();
		};
		visCurrentData.init();
		visTree.init();
		

	};

    $('#dtlRestartButton').click(init);
    init();
	
});

function isPresent(arr1 , arr2){
	for(var i=0 ; i<arr1.length;i++){
		if( JSON.stringify(arr1[i])==JSON.stringify(arr2)){
			return 1;
		}
	}
	return 0;
};

function drawExamples(canvas,height,width,currentAttributes,currentExamples){
	this.canvas = canvas;
	this.exampleColor1 = 'hsl(17, 84%, 83%)';
	this.exampleColor2 = 'hsl(270, 93%, 65%)';
	this.attributeColor= 'hsl(178, 46%, 44%)';
	this.radius = 30;
	this.height = height;
	this.width = width;
	this.currentExamples = currentExamples;
	this.currentAttributes = currentAttributes;
	this.dataset = getdata();
	this.Examples1 = [];
	this.Examples2 = [];
	this.Attributes = [];
	this.clickHandler = null;

		this.init = function(){

		console.log("---------------");
		console.log(this.currentExamples);
		console.log(this.currentAttributes);
		this.canvas.innerHTML= '';

		var posX1 = 50;
		var posY1 = 75;
		var posX2 = 50;
		var posY2 = 150;
		var posAx = 0;
		var posAy = 225;
		this.nodeGroups = [];
		this.two  = new Two({height:this.height,width:this.width}).appendTo(this.canvas);
		if(this.currentExamples.length >0){

			for(var i=0;i<this.dataset.examples.length;i++){
				if(this.dataset.examples[i][0]==this.dataset.values[0][0]){
					posX1 = posX1 +40;
        			var rect = this.two.makeRectangle(posX1,posY1,this.radius,this.radius);
       				rect.fill = this.exampleColor1;
        			this.Examples1.push(rect);
        			var text = this.two.makeText(i,posX1,posY1);
        			var group = this.two.makeGroup(rect,text);
     	 	  		this.two.update()
        			
      	  		}


				else{
					posX2 = posX2 +40;
        			var rect = this.two.makeRectangle(posX2,posY2,this.radius,this.radius);
    	    		rect.fill = this.exampleColor2;
        			this.Examples2.push(rect);
        			var text = this.two.makeText(i,posX2,posY2);
        			var group = this.two.makeGroup(rect,text);
	        		this.two.update()
//  	      		$(group._renderer.elem).css('cursor','pointer');
					
				}
      	  			this.nodeGroups.push(group);
      	  			if( isPresent(this.currentExamples , this.dataset.examples[i]) === 0){
	      				group.opacity = 0; 
        			}

			}
		}

		if(this.currentAttributes.length >0){
				for(var i=1;i<this.dataset.attrs.length;i++){
				  if(posAx+50 >= 400){
				  	posAy= 280;
				  	posAx = 100;
			  	}		
					posAx = posAx +50;
        		//var rect = this.two.makeRectangle(posAx,posAy,this.radius,this.radius);
        			var circle = this.two.makeCircle(posAx, posAy, this.radius-10);
        			circle.fill = this.attributeColor;
        			this.Attributes.push(circle);
        			var text = this.two.makeText(this.dataset.attributes[i],posAx,posAy);
        			var group = this.two.makeGroup(circle,text);
        			this.two.update()
        			$(group._renderer.elem).attr('Index',i);
      	  			$(group._renderer.elem).attr('State',1);
      				if(isPresent(this.currentAttributes , this.dataset.attrs[i]) === 0 ){
	      				group.opacity = 0;
	      				$(group._renderer.elem).css('cursor','default');
        			}
        			else{
        				$(group._renderer.elem).css('cursor','pointer');
        				group._renderer.elem.onclick = this.clickHandler;
        			}
				
				}


		}
	 	this.two.update();
   	};

 
};

function drawTree(canvas,height,width,currentAttributes,currentExamples){

	this.canvas = canvas;
	this.height = height;
	this.width  = width;
	this.dataset = getdata();
	this.tree = {};	
	this.radius =20;
	this.canvas.innerHTML= '';
	this.nodeColor = 'hsl(240, 100%, 70%)'
	this.leafColor =  'hsl(140, 100%, 70%)';
	this.x = 200;
	this.y = 60;
	this.currentAttributes = currentAttributes;
	this.currentnNode = null;
	this.currentExamples = currentExamples;
	this.clickHandler = null;

	this.init = function(){
		this.tree = DecisionTreeLearner(this.dataset);
		this.two  = new Two({height:this.height,width:this.width}).appendTo(this.canvas);
		var circle = this.two.makeCircle(parseInt(this.x), parseInt(this.y), this.radius-10);
		circle.fill = this.nodeColor;
        this.two.update();
        $(circle._renderer.elem).css('cursor','pointer');
        $(circle._renderer.elem).attr('attrIndex',parseInt(this.tree.attr));	
        circle._renderer.elem.onclick = this.clickHandler;
        this.two.update();

	}

	this.classify = function(nodeindex){
			this.canvas.innerHTML = '';
			this.two  = new Two({height:this.height,width:this.width}).appendTo(this.canvas);
			var queue = [];
			var curInd = this.currentAttributes.indexOf(parseInt(nodeindex));
			this.currentAttributes.splice(curInd,1);
			var flag= 0;
			if(this.currentAttributes.indexOf(this.tree.attr) == -1){
				queue.push([this.tree,this.x,this.y]);
				var circle = this.two.makeCircle(parseInt(this.x), parseInt(this.y), this.radius-10);
				var text = this.two.makeText(this.tree.attr,this.x,this.y);
        		circle.fill = this.nodeColor;
        		this.two.update();
				var level = 0;
				while(queue.length!=0){
					var top = queue[0];
					console.log(this.currentAttributes);
					if( top[0] != undefined && 'branches' in top[0]){
						level = level+1;
						var childX = top[1] - 30;
						var childY = this.y + level*50;
						for(var i in top[0].branches){
							if(top[0].branches.hasOwnProperty(i)){
								if(top[0].branches[i] != undefined && 'branches' in top[0].branches[i]){
									if(this.currentAttributes.indexOf(top[0].branches[i].attr) == -1){
										queue.push([top[0].branches[i],childX,childY]);
										var line = this.two.makeLine(top[1],top[2]+6,childX , childY);
										var circle = this.two.makeCircle(childX, childY, this.radius-10);
        								var text = this.two.makeText(top[0].branches[i].attr,childX,childY);
        								circle.fill = this.nodeColor;
        								this.two.update();
										childX = childX + 30;
										if(top[0].branches[i].attr == nodeindex){
											flag = 1;
										}
									}
									else{
										var line = this.two.makeLine(top[1],top[2]+6,childX , childY);
										var circle = this.two.makeCircle(childX, childY, this.radius-10);
										var group = this.two.makeGroup(circle);
        								circle.fill = this.nodeColor;
        								this.two.update();
        								$(circle._renderer.elem).css('cursor','pointer');
        								this.currentExamples = top[0].branches[i].examples;
        								console.log(this.currentExamples);
        								$(circle._renderer.elem).attr('attrIndex',top[0].branches[i].attr)
        								circle._renderer.elem.onclick = this.clickHandler;
        								this.two.update();
										childX = childX + 30;

									}
								}	
								if(top[0].branches[i] != undefined && 'result' in top[0].branches[i]){
										queue.push(top[0].branches[i], childX,childY);
										var line = this.two.makeLine(top[1], top[2]+6 ,childX, childY);
										var circle = this.two.makeCircle(childX, childY, this.radius-10);
										var text = this.two.makeText(top[0].branches[i].result,childX,childY);
        								circle.fill = this.leafColor;
        								this.two.update();
										childX = childX + 30;
								}
	    					}

						}
					}	
					queue.splice(0,1);
					
			
				}

			}
				
			if(flag == 0 && nodeindex != this.tree.attr){
					this.currentAttributes.push(parseInt(nodeindex));
			};

			
	};

};
