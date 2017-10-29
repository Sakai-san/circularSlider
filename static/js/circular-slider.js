
$(function(){

  const circularSlider = {
    radius: 0,
    container: null,
    items : null,
    angle : 0,
    vectors: [],
    radius : 0,

    init : function(container, radius,){
      this.container = container;
      this.radius   = radius;
      const items = container.find(".slide");
      this.setActive( this.container.find(".slide").first() );
      this.angle = items.length > 0 ? 360/items.length : 0;
      this.eventSubsribe();
      this.computetPositions();
      this.moveImages();
      const self = this;
      setTimeout( function()  { self.round(); }, 2000 ) ;
    },

    eventSubsribe(){
      const self = this;
      self.container.find(".slide").hover( function(){
        self.setActive( $(this) );
      });
    },

    degreeToRadian(degree){
      return (Math.PI * degree ) / 180;
    },

    random(min, max){
      return Math.floor(Math.random() * (max - min + 1) + min);
    },

    computetPositions(){
      const self = this;
       self.container.find(".slide").each( (index, element) => {
         const angleDegree = index* self.angle;
         const angleRadian = self.degreeToRadian(angleDegree);
         const coordinateX = self.radius * Math.cos( angleRadian );
         const coordinateY = self.radius * Math.sin( angleRadian );
         self.vectors.push([coordinateX, coordinateY]);
       });
    },

    removeActive(){
      this.container.find(".active").remove();
    },

    setActive( target ){
      this.removeActive();
      $(target).siblings(".slide").removeClass("red-border");       
      var clickedClone = $(target).clone().removeClass().css('transform', '').addClass("active");
      this.container.append(clickedClone);
    },

    moveImages(){
      const self = this;
       self.container.find(".slide").each( (index, element) => {
         const vector = self.vectors[index];
         const hasRotation = self.random(0,10) > 8 ? true : false;
         if(hasRotation){
           $(element)
            .css({
               transform: `translateX(${vector[0]}px) translateY(${vector[1]}px) rotate(${self.random(1,20)*360}deg) scale(0.3)`,
             });
          }
          else{
            $(element)
             .css({
                transform: `translateX(${vector[0]}px) translateY(${vector[1]}px) scale(0.3)`,
              })
          }
       });

    },

    round(){
      const self = this;
      self.container.find(".slide").each( (index, element) => {
        setTimeout(
    			( function(arg1) {
    				return function() {
              $(arg1).addClass("red-border").siblings(".slide").removeClass("red-border");
              $(arg1).trigger('mouseover');
    				};
    			} ) ( element ),
    			index*200
    		);
     });
    }
  };



  circularSlider.init( $("#circular-slider"), $(window).width() / 2 -60);
});
