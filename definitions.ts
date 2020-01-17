export interface Business {
  address?: string;
  address2?: string;
  city?: string;
  country?: string;
  name?: string;
  phone?: string; // string in case extensions like "+3" or different country codes are ever used
  state?: string;
  uuid?: string; // can be a uuid format or a string of 40 characters (hash from `object-hash`)
  website?: string;
  zip?: string; // even though it's a number, it can start with 0 so better treat as a string
}
