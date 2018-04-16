var app = angular.module('myApp', []);


app.controller("MoviesListCtrl", function($scope, $http){
	$scope.fields = [
    'title',
    'releaseDate',
    'popularity',
	];
  
  $http.get('data/movies.json').success(function (data){
		$scope.movies = data;
		
		$scope.dataSize = data.length;
		var r = [], o = {};
		
		data.forEach( function( a )
		  {
			  
			if (!o[a.rating]) {
					o[a.rating] = { key: a.rating, value: 0 };
					r.push(o[a.rating]);
				}
				o[a.rating].value ++;  
		  });	

		data = r;
		
	});
  
	var todaysDate = new Date();
    $scope.todaysDate = todaysDate;
    var dd = todaysDate.getDate();

    var mm = todaysDate.getMonth()+1; 
    var yyyy = todaysDate.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 
    
    if(mm<10) 
    {
        mm='0'+mm;
    } 
    $scope.todayDate = yyyy+'-'+mm+'-'+dd;
  
  $scope.orderChanged = function($event, orderBy){
	  $scope.sortorder = orderBy;
      
  }
  $scope.setActive = function (val) {
  	return $scope.sortorder === val;
  }
  
  $scope.rateFunction = function(rating) {
      console.log('Rating selected: ' + rating);
    };
	
  
	$scope.sortorder = 'title';
  
});

app.directive("starRating", function() {
    return {
        restrict: 'EA',
        template:
        '<ul class="star-rating" ng-class="{readonly: readonly}">' +
        '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
        '    <i class="fa fa-star"></i>' + // or &#9733
        '  </li>' +
        '</ul>',
        scope: {
            ratingValue: '=ngModel',
            max: '=?',
            onRatingSelect: '&?',
            readonly: '=?'
        },
        link: function(scope, element, attributes) {
            if (scope.max == undefined) {
                scope.max = 5;
            }
            function updateStars() {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };
            scope.toggle = function(index) {
                if (scope.readonly == undefined || scope.readonly === false){
                    scope.ratingValue = index + 1;
                    scope.onRatingSelect({
                        rating: index + 1
                    });
                }
            };
            scope.$watch('ratingValue', function(oldValue, newValue) {
                if (newValue || newValue === 0) {
                    updateStars();
                    var movies = scope.$parent.movies;

                    debugger;
                    var r = [], o = {};
                    var map = new Map();
                    for(var i = 0; i < 6; i++) {
                        map.set(i+'', 0);
                    }
                    movies.forEach( function( a ) {
                        map.set(a.rating+'', map.get(a.rating+'')+1);
                    });
                    var data = [];
                    for(var i = 0; i < 6; i++) {
                    	var key = i+'';
                    	var val = map.get(key)
                        data.push({ key: key, value: val });
                    }
                    // var data = r;
                    var margin = {top:10, right:10, bottom:90, left:10};

                    var width = 300 - margin.left - margin.right;

                    var height = 300 - margin.top - margin.bottom;

                    var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .03)

                    var yScale = d3.scale.linear()
                        .range([height, 0]);


                    var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom");


                    var yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient("left");

                    d3.select("#chartID").html('');

                    var svgContainer = d3.select("#chartID").append("svg")
                        .attr("width", width+margin.left + margin.right)
                        .attr("height",height+margin.top + margin.bottom)
                        .append("g").attr("class", "container")
                        .attr("transform", "translate("+ margin.left +","+ margin.top +")");

                    xScale.domain(data.map(function(d) { return d.key; }));
                    yScale.domain([0, d3.max(data, function(d) { return d.value; })]);


                    svgContainer.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + (height) + ")")
                        .call(xAxis)
                        .selectAll("text");
				    

                    svgContainer.selectAll(".bar")
                        .data(data)
                        .enter()
                        .append("rect")
                        .attr("class", "bar")
                        .attr("x", function(d) { return xScale(d.key); })
                        .attr("width", xScale.rangeBand())
                        .attr("y", function(d) { return yScale(d.value); })
                        .attr("height", function(d) { return height - yScale(d.value); });


                    svgContainer.selectAll(".text")
                        .data(data)
                        .enter()
                        .append("text")
                        .attr("class","label")
                        .attr("x", (function(d) { return xScale(d.key) + xScale.rangeBand() / 2 ; }  ))
                        .attr("y", function(d) { return yScale(d.value) + 1; })
                        .attr("dy", ".75em")
                        .text(function(d) { return d.value; });

                    var width = 700,   // width of svg
                        height = 400,  // height of svg
                        padding = 100; // space around the chart, not including labels


                    svgContainer.append("text")
                        .attr("text-anchor", "middle")  
                        .attr("transform", "translate("+ 0 +","+(height/2-80)+")rotate(-90)")  
                        .text("Number of Ratings");


                }
            });
        }
    };
});