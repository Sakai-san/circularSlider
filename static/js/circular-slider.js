
$(function(){

  const circularSlider = {
    radius: 0,
    container: null,
    items : null,
    angle : 0,
    slides: {},
    radius : 0,

    init : function(container, radius,){
      this.container = container;
      this.radius   = radius;
      const items = container.find(".slide");
      this.setActive( this.container.find(".slide").first() );
      this.angle = items.length > 0 ? 360/items.length : 0;
      this.eventSubsribe();
      this.computeShifts();
      this.moveImages();
      const self = this;

      setTimeout( () =>  {
        setInterval( () => {self.revolution()}, 2000 );
      }, 2000);
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

    revolution(){
      const self = this;
      const slides = self.container.find(".slide");
      slides.each( (index, element) => {
        const angleDegree     = self.shifts[$(element).attr("src")].angleDegree;
        const newAngleDegree = angleDegree + self.angle;
        const newAngleRadian  = self.degreeToRadian(newAngleDegree);
        const newPosX     = self.radius * Math.cos( newAngleRadian );
        const newPosY     = self.radius * Math.sin( newAngleRadian );
        self.setShift($(element).attr("src"), newAngleDegree, newAngleRadian, newPosX, newPosY);
        $(element)
        .css({
           transform: `translateX(${newPosX}px) translateY(${newPosY}px) scale(0.3)`,
         });
      });
    },

    diagonal( angle, semiHeight ){
      return semiHeight / Math.sin( angle);
    },

    setShift(imageSource, angleDegree, angleRadian, coordinateX, coordinateY ){
      this.shifts[imageSource] = {
         angleDegree  : angleDegree,
         angleRadian  : angleRadian,
         posX         : coordinateX,
         posY         : coordinateY,
      };
    },

    computeShifts(){
      const self = this;
       self.container.find(".slide").each( (index, element) => {
         const angleDegree = index* self.angle;
         const angleRadian = self.degreeToRadian(angleDegree);
         const internalRadius = self.radius -  self.diagonal(angleRadian, $(element).height()*0.3 /2) ;
         console.log(internalRadius);
         const subtraction = Math.max( $(element).width() / 2, $(element).height() / 2 ) *0;
         const coordinateX = self.radius * Math.cos( angleRadian ) - subtraction*0.3;
         const coordinateY = self.radius * Math.sin( angleRadian ) - subtraction*0.3;
         self.setShift($(element).attr("src"), angleDegree, angleRadian, coordinateX, coordinateY);
       });
    },

    removeActive(){
      this.container.find(".active").remove();
    },

    setActive( target ){
      this.removeActive();
      $(target).siblings(".slide").removeClass("red-border");
      var clickedClone = $(target).clone().removeClass().css('transform', 'scale(0.5)').addClass("active");
      this.container.append(clickedClone);
    },

    moveImages(){
      const self = this;
       self.container.find(".slide").each( (index, element) => {
         const shift = self.shifts[$(element).attr("src")];
         const hasRotation = self.random(0,10) > 8 ? true : false;

         if(hasRotation){
           if( index === 10000 ){
             $(element).css({ animation: 'sunrise 2s 1s infinite alternate'});
           }
           else{
             $(element)
              .css({
                 transform: `translateX(${shift.posX}px) translateY(${shift.posY}px) rotate(${self.random(1,20)*360}deg) scale(0.3)`,
               });
             }
          }
          else{
            $(element)
             .css({
                transform: `translateX(${shift.posX}px) translateY(${shift.posY}px) scale(0.3)`,
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


  circularSlider.init( $("#circular-slider"), $(window).width() /  4.1);
});
