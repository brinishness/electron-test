// @ts-ignore
import sha1 from "sha1";
export function randString(x: number): string {
  let s = "";
  while (s.length < x && x > 0) {
    const v = Math.random() < 0.5 ? 32 : 0;
    s += String.fromCharCode(
      Math.round(Math.random() * (122 - v - (97 - v)) + (97 - v))
    );
  }
  return s;
}

export const getNonce = randString(20);
export const getCurTime = new Date().getTime().toString().slice(0, 10);
export function CheckSum(AppSecret: string, Nonce: string, CurTime: string): sha1 {
  return sha1(AppSecret + Nonce + CurTime);
}
