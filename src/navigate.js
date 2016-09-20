
/*
 * jQuery.navigate - Navigate to elements with the keyboard arrows
 * Craig Payne 
 * @version 0.1
 */

(function($){

    var handleKeyDown;
    var handleScroll;
    var navigate;
    var generateData;
    var options;
    var $current;
    var $collection;
    var $elements;

    // Element object
    function Element(id, coordinates, active) {
        this.id = id;
        this.coordinates = coordinates;
        this.active = active;
    }

    // Default values
    var defaults = {        
        speed: 500,
        keys: {            
            left: 37,
            right: 39            
        }
    };

    var methods = {
        init : function(o) {
    
            options = $.extend(defaults, o);
            $collection = this;
            $elements = [];

            //--------------------
            // Keyboard event
            //--------------------
            handleKeyDown = function(e){
                if(!e) { var e = window.event; }

                switch(e.keyCode) {                      
                    case options.keys.left:
                        navigate(0);
                        break;
                    case options.keys.right:
                        navigate(1);
                        break;                    
                }
             
            };

            //--------------------
            // Scroll event
            //--------------------
            handleScroll = function() {
                var win = $(window);

                var viewport = {
                    top : win.scrollTop(),
                    left : win.scrollLeft()
                };
                
                viewport.right = viewport.left + win.width();
                viewport.bottom = viewport.top + win.height();

                changeStatus(false);

                for (var i = 0; i< $elements.length; i++) {                                    

                    // if visible
                    if ((!(viewport.right < $elements[i].coordinates.left 
                        || viewport.left > $elements[i].coordinates.right 
                        || viewport.bottom < $elements[i].coordinates.top 
                        || viewport.top > $elements[i].coordinates.bottom))) {
                            $elements[i].active = true;
                            break; // only grab first element
                    }
                    
                }

                if (viewport.top <= $elements[0].coordinates.top) {
                    $elements[0].active = true;
                }

                if (viewport.top >= $elements[$elements.length-1].coordinates.top) {
                    $elements[$elements.length-1].active = true;
                }                

            }
          
            //--------------------------
            // Generating element data
            //--------------------------
            generateData = function() {

                $($collection).each(function( index, elm ) {

                    var id = index;
                    var coordinates = $(this).offset();
                    coordinates.right = coordinates.left + $(this).outerWidth();
                    coordinates.bottom = coordinates.top + $(this).outerHeight();

                    var active = false;
                    var element_obj = new Element(id, coordinates, active);

                    $elements.push(element_obj);

                });
             
            }

            //------------------------
            // Update element status
            //------------------------
            changeStatus = function(status) {
                for (var i = 0; i< $elements.length; i++) { 
                    $elements[i].active = status;
                }
            }

            //------------------------
            // Get current active
            //------------------------
            getCurrentElement = function() {
                for (var i = 0; i < $elements.length; i++) { 
                    if ($elements[i].active) return $elements[i];
                }
            }

            //------------------------
            // Get element by index
            //------------------------
            getElementById = function(id) {
                for (var i = 0; i < $elements.length; i++) { 
                    if ($elements[i].id == id) return $elements[i];
                }                
            }

            //---------------------------
            // Get next and prev element
            //------------------------
            getPrevNextElement = function() {
                var $cur_element = getCurrentElement();
                var $prev_next_elements = []

               
                if ($cur_element.id == 0 ) { 
                    $prev_next_elements.push($cur_element); }
                else {
                    $prev_next_elements.push(getElementById($cur_element.id-1));
                }

                if ($cur_element.id == ($elements.length-1) ) { 
                    $prev_next_elements.push( $cur_element); }
                else {
                    $prev_next_elements.push(getElementById($cur_element.id+1));
                }

                return $prev_next_elements;
               
            }

            //------------------------
            // Keyboard navigation
            //------------------------
            navigate = function(x) {
        
                var $elm = getCurrentElement();
                var $prev_next = getPrevNextElement();

                if ($(window).scrollTop() != $elm.coordinates.top) {
                    scrollTo($elm.coordinates.top);
                }


                if ($(window).scrollTop() == $elm.coordinates.top) {
                    console.log('here');
                    console.log("x"+x)
                    console.log($prev_next);
                    // $prev_next
                    scrollTo($prev_next[x].coordinates.top);

                }


            }
            

            //------------------------
            // Scroll to animation
            //------------------------
            scrollTo = function(top) {
                $('html, body').stop().animate({
                    scrollTop: top
                }, options.speed);
            }
          
            generateData();
            handleScroll();

            $(document).bind('keydown', handleKeyDown);
            $(window).bind('scroll', handleScroll);  

            return this;
        },


        destroy : function(){
            return this;
        }
    };


    $.fn.navigate = function( method ) {    
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.navigate' );
        }

    };

})(jQuery);
