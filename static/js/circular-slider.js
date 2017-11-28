
$(function(){

  const circularSlider = {
    container: null,
    items : null,
    angle : 0,
    slidesWithPositions : {},

    init : function(container, radius,){
      const self = this;
      this.container = container;
      const items = container.find(".slide");
//      this.setActive( this.container.find(".slide").first() );
      this.angleDegree = items.length > 0 ? 360/items.length : 0;
      this.angleRadian = self.degreeToRadian(self.angleDegree);
      this.eventSubsribe();
      this.moveImages();
      const intervalHandle = setInterval(
        () => self.fastRevolution(100)
        , 100
      );

      setTimeout( () =>  {
        clearInterval(intervalHandle);
        setInterval( () => {self.revolution()}, 6000 );
      }, 5000);
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

    computePosition(angleRadian, thumbnail, scaleFactor){
      const outerRadius     = Math.min( $(window).width(), $(window).height() ) / 2;
      const innerRadius     = outerRadius - Math.min( $(thumbnail).width()*scaleFactor, $(thumbnail).height()*scaleFactor) / 2;
      const posX            = innerRadius * Math.cos( angleRadian );
      const posY            = innerRadius * Math.sin( angleRadian );
      return [posX, posY];
    },

    updateInfo(element){
      $(".info")
        .css({
          transform: "scale(0.6)"
        })
       .text( this.slidesWithPositions[$(element).attr("src")].description);
    },

    revolution(){
      const self = this;
      self.container.find(".slide").each( (index, element) => {
        self.updateInfo(element);
        const elementCustom   = self.slidesWithPositions[$(element).attr("src")];
        const newAngleRadian  = elementCustom.angleRadian + self.angleRadian;
        const positions       = self.computePosition(newAngleRadian, element, 0.3);
        self.setSlideWithPositions($(element).attr("src"), elementCustom.angleDegree + self.angleDegree, newAngleRadian, positions[0], positions[1]);
        $(element)
          .css({
              transform: `translateX(${positions[0]}px) translateY(${positions[1]}px) scale(0.3)`,
              transition: `transform linear 6s`,
           });
      });
    },

    fastRevolution( timeout ){
      const self = this;
      const asymetricDuration = self.random(1, 6)*timeout;
      self.container.find(".slide").each( (index, element) => {
        const elementCustom   = self.slidesWithPositions[$(element).attr("src")];
        const newAngleRadian  = elementCustom.angleRadian + self.angleRadian;
        const positions       = self.computePosition(newAngleRadian, element, 0.3);
        self.setSlideWithPositions($(element).attr("src"), elementCustom.angleDegree + self.angleDegree, newAngleRadian, positions[0], positions[1]);
        $(element)
          .css({
            transition: `transform ease-out ${asymetricDuration}ms`,
            transform: `translateX(${positions[0]}px) translateY(${positions[1]}px) scale(0.3)`,
           });
      });
    },

    diagonal( angle, semiHeight ){
      return semiHeight / Math.sin( angle);
    },

    setSlideWithPositions(imageSource, angleDegree, angleRadian, coordinateX, coordinateY, price=null, description=null, ingredients=null ){
      this.slidesWithPositions[imageSource] = {
         angleDegree  : angleDegree,
         angleRadian  : angleRadian,
         posX         : coordinateX,
         posY         : coordinateY,
         price        : !price && this.slidesWithPositions[imageSource] && this.slidesWithPositions[imageSource].price ? this.slidesWithPositions[imageSource].price : price,
         description  : !description && this.slidesWithPositions[imageSource] && this.slidesWithPositions[imageSource].description ? this.slidesWithPositions[imageSource].description : description,
         ingredients  : !ingredients && this.slidesWithPositions[imageSource] && this.slidesWithPositions[imageSource].ingredients ? this.slidesWithPositions[imageSource].ingredients : ingredients
      };
    },

    doShift( index, element){
       const angleRadian = index*this.angleRadian;
       const positions = this.computePosition(angleRadian, element, 0.3);
       this.setSlideWithPositions($(element).attr("src"), index*this.angleDegree, angleRadian, positions[0], positions[1], $(element).data("price"), $(element).data("description"));
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
         self.doShift(index, element);
         const shift = self.slidesWithPositions[$(element).attr("src")];
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


  circularSlider.init( $("#circular-slider") );
});
