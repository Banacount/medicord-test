let textStack = 0;
const pageMargin = { 'x': 200, 'y': 200 }; const spacing = 20;
const sizes = {
   'p': 44, 't1': 80, 't2': 65, 't3': 50
};
const colors = {
   'high': "#70809dff"
}

const makeTextRight = (size, color, font, text, extras, fontArgs) => {
   const ctx = extras.ctx;
   ctx.fillStyle = color;
   ctx.font = `${fontArgs} ${size}px ${font}`;
   let textSize = ctx.measureText(text);
   ctx.fillText(text, extras.pageSize.x - (pageMargin.x+textSize.width), pageMargin.y+textStack+size);
   textStack += size + spacing;
};

const makeTextLeft = (size, color, font, text, extras, fontArgs) => {
   const ctx = extras.ctx;
   ctx.fillStyle = color;
   ctx.font = `${fontArgs} ${size}px ${font}`;
   let textSize = ctx.measureText(text);
   ctx.fillText(text, pageMargin.x, pageMargin.y+textStack+size);
   textStack += size + spacing;
};

const makeTextLeftWrapped = (size, color, font, text, extras, fontArgs, maxWidth) => {
   const ctx = extras.ctx;
   ctx.fillStyle = color;
   ctx.font = `${fontArgs} ${size}px ${font}`;

   const words = text.split(" ");
   let line = "";

   for (let w of words) {
      const testLine = line + w + " ";
      const testWidth = ctx.measureText(testLine).width;

      // If it overflows, draw current line and start a new one
      if (testWidth > maxWidth) {
         ctx.fillText(line, pageMargin.x, pageMargin.y + textStack + size);
         textStack += size + spacing;
         line = w + " ";
      } else {
         line = testLine;
      }
   }

   // Draw last line
   if (line.trim().length > 0) {
      ctx.fillText(line, pageMargin.x, pageMargin.y + textStack + size);
      textStack += size + spacing;
   }
};


const makeTextAbs = (size, color, font, text, extras, fontArgs) => {
   const ctx = extras.ctx;
   ctx.fillStyle = color;
   ctx.font = `${fontArgs} ${size}px ${font}`;
   let textSize = ctx.measureText(text);
   ctx.fillText(text, pageMargin.x+extras.x, pageMargin.y+textStack+size+extras.y);
};

const lineFr = (thickness, color, extras) => {
   const ctx = extras.ctx;
   ctx.fillStyle = color;
   ctx.fillRect(pageMargin.x, pageMargin.y+textStack+spacing, extras.pageSize.x - pageMargin.x*2, thickness);
   textStack += thickness + spacing*2;
};


export const drawDocument = (canvas_id) => {
   const canv = document.getElementById(canvas_id);
   const ctx = canv.getContext("2d");
   const pageSize = { 'x': canv.width, 'y': canv.height }; 
   const pageMargWidth = pageSize.x-(pageMargin.x*2);
   let mainFont = "'Google Sans'";
   let mainWeight = 400;

   //Hospital data
   ctx.clearRect(0, 0, canv.width, canv.height);
   let hospitalName = "Hospital name.";
   let hospitalStreet = "Hostpital street address.";
   let hospitalCity = "Hostpital city."
   let contactNumber = "09123123123123";
   let email = "test@email.com";
   let website = "www.example.com";
   let createdDate = "12/11/2025";

   //Patient data
   let patient = {
      'name': "Test bottowski", 'number': "0929877155", 
      'address': "Hell no, CDO", 
      'birth_date': "1/1/2000", 'weight': "67.67", 'height': "167"
   }

   //bg
   ctx.fillStyle = "white";
   ctx.fillRect(0, 0, pageSize.x, pageSize.y);

   //logo stamp
   const logoIco = new Image();
   logoIco.src = "./img/icon.svg";
   logoIco.onload = () => { ctx.drawImage(logoIco, pageMargin.x, pageMargin.y, 300, 300) };

   //text1 - where
   makeTextRight(sizes.p, "black", mainFont, hospitalName, { pageSize, ctx }, mainWeight);
   makeTextRight(sizes.p, "black", mainFont, hospitalStreet, { pageSize, ctx }, mainWeight);
   makeTextRight(sizes.p, "black", mainFont, hospitalCity, { pageSize, ctx }, mainWeight);
   //text2 - contact info and date
   makeTextRight(sizes.p, "black", mainFont, `Phone: ${contactNumber} | Email: ${email}`, { pageSize, ctx }, mainWeight);
   makeTextRight(sizes.p, "black", mainFont, `Website: ${website}`, { pageSize, ctx }, mainWeight);
   textStack += sizes.p+spacing;
   makeTextRight(sizes.p, "black", mainFont, createdDate, { pageSize, ctx }, 600);
   //text3
   makeTextLeft(sizes.t1, colors.high, mainFont, "Patient Medical Record", { ctx }, 700);
   lineFr(10, colors.high, { pageSize, ctx });
   textStack += sizes.p+spacing;
   makeTextLeft(sizes.t2, colors.high, mainFont, "   Patient information", { ctx }, 700);
   textStack += sizes.p+spacing;
   makeTextAbs(sizes.t3, "black", mainFont, `Name: ${patient.name}`, { ctx, x: 50, y: -50 }, 500);
   makeTextAbs(sizes.t3, "black", mainFont, `Contact No. ${patient.number}`, { ctx, x: 900, y: -50 }, 500);
   makeTextAbs(sizes.t3, "black", mainFont, `Birth Date: ${patient.birth_date}`, { ctx, x: 50, y: 30 }, 500);
   makeTextAbs(sizes.t3, "black", mainFont, `Weight: ${patient.weight}`, { ctx, x: 900, y: 30 }, 500);
   makeTextAbs(sizes.t3, "black", mainFont, `Height: ${patient.height}`, { ctx, x: 900, y: 110 }, 500);
   makeTextAbs(sizes.p, "black", mainFont, `Address: ${patient.address}`, { ctx, x: 50, y: 190 }, 500);
   textStack += 500;
   //text4
   makeTextLeft(sizes.t2, colors.high, mainFont, "General Medical History", { ctx }, 700);
   lineFr(10, colors.high, { pageSize, ctx });
   makeTextLeft(sizes.t3, colors.high, mainFont, "Allergies:", { ctx }, 700);
   makeTextLeftWrapped(sizes.t3, "black", mainFont, "Peanuts, Crustacean shellfish, Soybeans, Sesame seeds, Eggs, Wheat.", { ctx }, 400, pageMargWidth);
   textStack += sizes.p+spacing;
   makeTextLeft(sizes.t3, colors.high, mainFont, "Medical Problems:", { ctx }, 700);
   makeTextLeftWrapped(sizes.t3, "black", mainFont, "Mild asthma, controlled with medication Occasional migraines, triggered by stress Hypertension, managed with lifestyle changes.", { ctx }, 400, pageMargWidth);
   textStack += sizes.p+spacing;
   makeTextLeft(sizes.t3, colors.high, mainFont, "Vaccines taken:", { ctx }, 700);
   makeTextLeftWrapped(sizes.t3, "black", mainFont, "Chickenpox (Varicella), Measles (MMR), Polio (Poliomyelitis), Tetanus, Influenza (Flu), COVID-19, Human Papillomavirus (HPV)", { ctx }, 400, pageMargWidth);
   textStack += sizes.p+spacing;
   makeTextLeft(sizes.t3, colors.high, mainFont, "Medications taken regularly", { ctx }, 700);
   makeTextLeftWrapped(sizes.t3, "black", mainFont, "Albuterol inhaler (for asthma) – as needed Metoprolol 25mg (for blood pressure) – once daily Ibuprofen 200mg (for migraines) – as needed", { ctx }, 400, pageMargWidth);
   textStack += sizes.p+spacing;
   makeTextLeft(sizes.t3, colors.high, mainFont,"Do you have medical insurance?", { ctx }, 700);
   makeTextAbs(sizes.p, "black", mainFont, `Yes`, { ctx, x: 780, y: -66 }, 900);
   textStack += sizes.p+spacing;
   makeTextLeft(sizes.t3, colors.high, mainFont, "Insurance Company: ", { ctx }, 700);
   makeTextLeftWrapped(sizes.t3, "black", mainFont, "ACME Insurance 4208 Crestview Manor Indianapolis, Indiana(IN), 46204", { ctx }, 400, pageMargWidth);
}