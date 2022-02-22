import { MersenneTwister19937, Random } from "random-js";

export const RED = "#FF0000";
export const GREEN = "#008000";
export const GOLD = "#ffd700";
export const BROWN = "#c66a10";
export const SILVER = "#c0c0c0";
export const GREEN_CIRLE = "🟢";
export const RED_CIRCLE = "🔴";

export function sleep(time: number) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  })
}

export const random = new Random(MersenneTwister19937.autoSeed());

export function formatPercent(num: number) {
  return `${(num * 100).toFixed(2)}%`
}

export function inlineCode(str: string | number) {
  return `\`${str}\``;
}

export function bold(str: string | number) {
  return `**${str}**`;
}

export function isEven(num: number) {
  return num % 2 === 0;
}
