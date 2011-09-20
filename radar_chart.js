;(function($) {

    $.RadarChart = function(el, options) {
        
       function Point(x, y) {
          this.x = x;
          this.y = y;
          
          this.toString = function() {
            return x + " " + y + " ";
          }
        }  
        Point.prototype.RADIUS = 3;

        var gridStyle = {
          RADAR: 'radar',
          ROUND: 'round'
        };
        
        var defaults = {
            radius:          150,
            angle:           Math.PI * 1.5,            
            gridStyle:       gridStyle.RADAR,
            gridIntervals:   5,
            gridColour:      "#CCC",
            gridFill:        "#EEE",
            gridStrokeWidth: 2
            
            // onSomeEvent: function() {}
        };

        var plugin = this;

        plugin.settings = {};

        var init = function() {
            plugin.settings = $.extend({}, defaults, options);
            plugin.el = $(el);
            
            plugin.paper = Raphael( plugin.el.attr('id'),
                                    plugin.el.width(),
                                    plugin.el.height()
                           );
        };

        // public methods
        plugin.draw = function(data, options) {
          var radius    = plugin.settings.radius,
              sides     = data.variables.length,
              angle     = plugin.settings.angle,
              gridStyle = plugin.settings.gridStyle;
          
          var vertices = calculateVertices(radius, sides, angle);

          drawGrid(radius, vertices, gridStyle);
          drawLabels(radius, vertices, data.variables);
        }

        // private methods
        var calculateVertices = function(radius, sides, angle) {
          var vertices = [];

          // calculate vertice coordinates
          for (var i = 0; i < sides; i++) {
            var x = radius * Math.cos(angle),
                y = radius * Math.sin(angle);
                
            vertices.push( new Point(x, y) );
            
            angle += (2 * Math.PI) / sides;
          }

          return vertices;
        };
        
        var drawGrid = function(radius, vertices, style) {
          switch(style.toLowerCase())
          {
          case gridStyle.RADAR:
            drawPolygonGrid(vertices);
            break;
          case gridStyle.ROUND:
            drawCircleGrid(radius, plugin.settings.gridInterval);
            break;
          default:
            // throw error
            alert("Grid style should be 'radar' or 'spider'");
          }
        };
        
        var drawPolygonGrid = function(vertices) {
          // join vertices
          var path = "M " + vertices.join("L ") + "Z",
              polygon = plugin.paper.path(path);
          
          applyGridAttributes(polygon);
          polygon.translate( plugin.paper.width / 2, plugin.paper.height / 2);
          
          if (plugin.settings.gridIntervals > 0) {
            drawIntervals(polygon);
          }
        };

        var drawCircleGrid = function(radius) {
          var x = plugin.paper.width / 2,
              y = plugin.paper.height / 2,
              circle = plugin.paper.circle( x, y, radius);          
          
          applyGridAttributes(circle)

          if (plugin.settings.gridIntervals > 0) {
            drawIntervals(circle);
          }          
        };
                
        var applyGridAttributes = function(shape) {
          shape.attr({
            'stroke':       plugin.settings.gridColour,
            'stroke-width': plugin.settings.gridStrokeWidth,
            'fill':         plugin.settings.gridFill
          });
        };
        
        var drawIntervals = function(shape) {
          for (var i = plugin.settings.gridIntervals-1; i > 0; i --) {
            var inner = shape.clone();
            var scale = i * (1 / plugin.settings.gridIntervals);            
            inner.scale(scale, scale);            
          }
        };
        
        var drawLabels = function(radius, vertices, variables) {
          $(vertices).each(function(i, vertice) {
            var text = plugin.paper.text(vertice.x, vertice.y, variables[i]);
            // applyGridAttributes(text);
            text.translate(plugin.paper.width/2, plugin.paper.height/2);
          });
        };
        
        init();
    };  

})(jQuery);
