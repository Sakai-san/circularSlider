
$(function(){

  const circularSlider = {
    radius: 0,
    container: null,
    items : null,
    angle : 0,
    vectors: [],

    init : function(container){
      this.container = container;
      const items = container.find("> div > img");
      this.angle = items && items.length > 0 ? 360/items.length : 0;
      this.computetPositions();
      this.moveThumbnail();
    },

    degreeToRadian(degree){
      return (Math.PI * degree ) / 180;
    },

    computetPositions(){
      const self = this;
       self.container.find("> div > img").each( (index, element) => {
         const angleDegree = index* self.angle;
         const angleRadian = self.degreeToRadian(angleDegree);
         const coordinateX = 500 * Math.cos(angleRadian );
         const coordinateY = 500 * Math.sin( angleRadian );
         self.vectors.push([angleDegree, angleRadian, coordinateX, coordinateY]);
       });
    },

    moveThumbnail(){
      const self = this;
       self.container.find("> div > img").each( (index, element) => {
         const vector = self.vectors[index];
         $(element).css(
           {
            'transform-origin': '50% 50%',
             transform: `translateX(${vector[2]}px) translateY(${vector[3]}px) rotate(${vector[0]}deg)`,
             width: '50px',
             height: '50px',
           });
       });
    }
  };

  circularSlider.init( $("#circular-slider") );

});
