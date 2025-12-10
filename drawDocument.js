
export const drawDocument = (canvas_id) => {
   const canv = document.getElementById(canvas_id);
   const ctx = canv.getContext("2d");
   //bg
   ctx.fillStyle = "white";
   ctx.fillRect(0, 0, 500, 600);
   //text1
   ctx.fillStyle = "black";
   ctx.font = "15px Montserrat";
   ctx.fillText("test", 20, 20);
}