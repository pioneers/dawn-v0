import fs from 'fs';
export const stationNumber = parseInt(localStorage.getItem('stationNumber') || '0');
export const bridgeAddress = localStorage.getItem('bridgeAddress') || "10.31.1.187";
console.log("station: " + stationNumber)
console.log("bridge: " + bridgeAddress)
