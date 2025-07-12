function roundWithSigns(a, s=0, strOrNum=true){
    return strOrNum ? Number(a.toFixed(s)) : a.toFixed(s);
}

function copyMass(mass) {
    let newMass = [];
    for (let y = 0; y < mass.length; y++) {
        newMass.push(mass[y].slice(0))
    }
    return newMass;
}

function findFood() {
    return map.some(m => m.includes(2));
}

function fillRect(x, y, width, height, color) {
    cx.fillStyle = color;
    cx.fillRect(x, y, width, height);
}

function countDist(x1, y1, x2, y2) {
    return Math.hypot(x1-x2, y1-y2);
}