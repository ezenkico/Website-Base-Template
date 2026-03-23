import jwt from "jsonwebtoken";
import axios from "axios";

const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export function isEmailValid(email: string){
  if (!email)
    return false;

  if(email.length>254)
      return false;

  const valid = emailRegex.test(email);
  if(!valid)
      return false;

  // Further checking of some things regex can't handle
  const parts = email.split("@");
  if(parts[0].length>64)
      return false;

  const domainParts = parts[1].split(".");
  if(domainParts.some(function(part) { return part.length>63; }))
      return false;

  return true;
}

export async function validateCaptcha(token: string): Promise<boolean>{
  const secret = process.env.GOOGLE_RECAPTCHA_SECRET;

  if (!secret) {
    console.error('Missing GOOGLE_RECAPTCHA_SECRET');
    return false;
  }

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
  try {
    const response = await fetch(url, {
      method: 'POST'
    });

    const data: any = await response.json();

    if (!data.success) {
      console.warn('Captcha validation failed:', data['error-codes']);
    }

    return data.success === true;
  } catch (error) {
    console.error('Captcha validation error:', error);
    return false;
  }
}

export class BadResponse extends Error {
    status: number
    contentType: string | undefined
    constructor(status: number, message: any, contentType?: string) {
      super(message);
      this.message = message;
      this.status = status;
      this.contentType = contentType;
    }

    toResponse(){
      const response = new Response(this.message, { status: this.status });
      if(this.contentType){
        response.headers.set('Content-Type', this.contentType);
      }
        return response;
    }
  }

export function error(status: number, message: string){
  return new BadResponse(status, message);
}

export function text(message: string){
  return new Response(message, {
    headers: {
      "content-type": "text/plain"
    }
  });
}

export function json(message: any){
  return new Response(JSON.stringify(message),{
    headers: {
      "content-type": "application/json"
    }
  })
}

export function verifyToken(token: string){
  try{
    const v = jwt.verify(token, process.env.TOKEN_SECRET ?? "");
    if(typeof v !== "object"){
      throw ""
    }
    if(!v["exp"]){
      throw "No expiration date"
    }
    if(v["exp"] < (Date.now() / 1000)){
      throw "Token has expired";
    }
    return v
  }catch{
    throw new BadResponse(401, "Invalid token");
  }
}

export function getTokenPayload(token: string){
  try{
    const v = jwt.verify(token, process.env.TOKEN_SECRET ?? "");
    if(typeof v !== "object"){
      return;
    }
    return v;
  }catch{
  }
}

export function generateToken(payload: any){
  console.log(process.env.TOKEN_SECRET);
  return jwt.sign(payload, process.env.TOKEN_SECRET ?? "")
}
