export interface VendorFormData {
  name: string;
  designation: string;
  companyName: string;
  firmType: string;
  vendorType: string;
  country: string;
  customCountry?: string;
  customCountryCode?: string;
  website?: string;
  contactNo: string;
  email: string;
  category: string;
  productDescription: string;
  majorClients?: string;
  turnover: string;
  turnoverCurrency: string; // 'INR' or 'USD'
  terms: boolean;
  referenceId?: string; // Added for tracking
}

export interface FileWithPreview extends File {
  preview?: string;
}

export interface Country {
  code: string;
  name: string;
  countryCode: string;
} 