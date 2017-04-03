
// send the dataset from c_DecisionTreeLearning
var Fork = function(attr,attrname,examples){
	this.attr = attr;
	this.examples = examples;
	this.attrname = attrname;
	this.branches= {};
	this.add = function(value,subtree){
	this.branches[value] = subtree;
	}

}

var Leaf = function(result,examples){
	this.result = result;
	this.examples = examples;
}




var DecisionTreeLearner = function(dataset){


    this.dataset = dataset;
    this.examples = dataset.examples;
    this.attrs = dataset.attrs;
    this.attributes = dataset.attributes;
    this.target = dataset.target;
    this.values = dataset.values;
    this.target = dataset.target;
    this.parent_examples = [];

   function  DecisionTreeLearning(examples,attrs,parent_examples){
    	if(examples.length===0){
    		return plurality_value(parent_examples)
    	} 
    	else if( all_same_class(examples) ){
    		return new Leaf(examples[0][target],examples)
    	}
    	else if(attrs.length===0){
    		return plurality_value(examples)
    	}
    	else{
    		var A = Importance(attrs,examples);
    		A= parseInt(A);
    		var tree = new Fork(A,attributes[A],examples);
    		//console.log( tree);
    		var example_sets = values_set(A,examples);
    		for ( var value in example_sets ) {
  				if (example_sets.hasOwnProperty(value)) {

    				var subtree = DecisionTreeLearning( example_sets[value] , remove_all(A,attrs),examples);

    				tree.add(parseInt(value),subtree);
    			}
    		}
        console.log(tree)
    		return tree;
    	}
	}
    
    function plurality_value(examples){
      var maximum =0;
      var list =[];
      var example_sets = values_set(target,examples);
      for (var key in example_sets) {
  			if (example_sets.hasOwnProperty(key)) {
  				if(example_sets[key].length >  maximum ){
      				maximum = example_sets[key].length;
      				list=[];
      				list.push(key);
      			}
      			else if (example_sets[key] === maximum) {
      				list.push(key);
      			}

  			}
		  }

      var popular = list[getRandomInt(0,list.length)];
      return Leaf(Object.keys(popular)[0],popular[0]);

    }

    function getRandomInt(min, max) {
    	max=max-1;
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	  }

    function Importance(attrs,examples){
    	var obj = {};
    	for(var i=0;i<attrs.length;i++){
    		if (attrs[i]!= 0){
    		obj[attrs[i]] = info_gain(attrs[i],examples) ;
    		}
    	}
    	console.log(obj);
    	var maximum= 0;
    	var list=[];
    	for (var key in obj) {
  			if (obj.hasOwnProperty(key)) {
  				if(obj[key] >  maximum ){
      				maximum = obj[key];
      				list=[];
      				list.push(key);
      			}
      			else if (obj[key] === maximum) {
      				list.push(key);
      			}

  			}
		  }
		  var important = list[getRandomInt(0,list.length)];
        return important;
    }


    function count(attr, val ,examples){
   		var count =0;
    	for( var i=0;i<examples.length;i++){
    		if(examples[i][attr]===val){
    			count=count+1;
    		}
    	}
    	return count;

    }

    function all_same_class(examples){
    	var class0 = examples[0][target];
    	for (var i = 0; i < examples.length; i++) {
    		if(examples[i][target] !== class0){
    			return false;
    		}
    	}	
    	return true;    
    }


    function remove_all(value,list){
    	for(var i=0 ; i< list.length ; i++){
    		if(list[i]===value){
    			list.splice(i,1)
    		}
    	}
    	return list;
    }


    function normalize(list){
    	var total=0;
    	for(var i =0;i<list.length;i++){
    		total=total+ parseInt(list[i]);
    	}
    	for(var i=0;i<list.length;i++){
    		list[i]= parseInt(list[i])/total;
    	}
    	return list;
    }


	function information_content(val){
    	 var probabilities = normalize(remove_all(0,val))
    	 var sum = 0;
    	 for(var i=0;i < probabilities.length ; i++){
    	 	var p=probabilities[i];
    	 	sum = sum + ((-p)* (Math.log(p)/Math.log(2)));
    	 }
    	 return sum;
    	}    


    function info_gain(attr , examples){
    	function bool_random_entropy(examples){
    		var list = [];
    		for ( var i=0;i<values[target].length;i++){
    			list.push(count(target , values[target][i] , examples));
    		}
    		return information_content(list);
    	}
    	var remainder = function(){
    		var n = examples.length;
    		var sum =0;
    		var example_sets =  values_set(attr,examples);

    		for (var key in example_sets) {
  				if (example_sets.hasOwnProperty(key)) {
      			}	
  			}
    		for (var key in example_sets) {
  				if (example_sets.hasOwnProperty(key)) {
  					if (example_sets[key].length!==0) {
	    				sum =sum + ((example_sets[key].length/ n) * bool_random_entropy(example_sets[key]));
    				}
  				}
			}
			return sum;

    	}
    	return bool_random_entropy(examples) - remainder();
    }




    function values_set(attr,examples){
    	var obj={};
    	console.log(attr + values[attr]);
    	for( var i=0;i< values[attr].length;i++){
    		var value = values[attr][i];
    		var set = []
    		for( var j=0;j<examples.length;j++){
    			if(examples[j][attr]=== value){
    				set.push(examples[j]);
    			}
    		}
    		obj[value]=set;
    	}
    	return obj;
    }

    return DecisionTreeLearning(examples,attrs,parent_examples);

}
//x= DecisionTreeLearner(dataset);
//console.log(x);
