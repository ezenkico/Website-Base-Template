import { BadResponse } from "@/types/response";
import { StrapiEndpoints } from "@/types/strapi";

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

const zipcodeRegex = /^\d{5}(-\d{4})?$/

export function isZipcodeValid(zipcode: string){
  if(!zipcode){
    return false;
  }

  return zipcodeRegex.test(zipcode);
}

export function numOrNull(num?: string | null){
  if(num == null){
    return null;
  }
  const value = Number(num);

  if(isNaN(value)){
    return null;
  }
  return value;
}

export function formatToUSD(amount : number, minimumFractionDigits = 2){
  return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: minimumFractionDigits,
  }).format(amount);
}

export const isBrowser = (): boolean => typeof window !== "undefined";

export async function sendRequest(
  endpoint: StrapiEndpoints, 
  url: string, 
  init?: RequestInit
){
  const usedEndpoint = isBrowser() ? endpoint.frontend : endpoint.backend;
  const response = await fetch(`${usedEndpoint}${url}`, init);
  if(!response.ok){
    throw new BadResponse(response.status, await response.text(), response.type);
  }
  return response;
}

export function setupAddress(
  clinic: {
    Address?: string,
    City?: string,
    State?: string
  }
){
  const {
    Address: address,
    City: city,
    State: state
  } = clinic;
  let result = '';

  if(address){
    result += address + ', ';
  }

  if(city){
    result += city + ", ";
  }

  if(state){
    result += state + ", ";
  }

  return result + "Mexico"
}

// Helper function to format date
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return dateString;
  }
}

// Helper function to extract tags from Strapi component
export function extractTags(tags: any[]): string[] {
  if (!Array.isArray(tags)) return [];
  return tags.map(tag => tag.name || tag.label || String(tag)).filter(Boolean);
}