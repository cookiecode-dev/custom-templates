export enum ServiceType {
  Functional = 'FUNCTIONAL',
  AnalyticalAnonymous = 'ANALYTICALANONYMOUS',
  Analytical = 'ANALYTICAL',
  Tracking = 'TRACKING',
}

export interface ServiceGroup {
  id: ServiceType;
  services: {
    id: string;
    name: string;
    description: string;
    group: string;
    icon: string;
    privacyStatement: string;
    consentRequired: boolean;
    hasConsent: boolean;
  }[];
  name: string;
  description: string;
  toggle: boolean;
}

export function getServicesGrouped(): ServiceGroup[] {
  const state = window.CookieCode.getState();
  const translationStrings = window.CookieCode.getTranslation();

  const servicesFunctional = Object.values(state.services).filter(x => x.group === ServiceType.Functional);
  const servicesAnalyticalAnonymous = Object.values(state.services).filter(
    x => x.group === ServiceType.AnalyticalAnonymous
  );
  const servicesAnalytical = Object.values(state.services).filter(x => x.group === ServiceType.Analytical);
  const servicesTracking = Object.values(state.services).filter(x => x.group === ServiceType.Tracking);

  let serviceGroups: ServiceGroup[] = [];

  if (servicesFunctional.length > 0) {
    serviceGroups.push({
      id: ServiceType.Functional,
      services: servicesFunctional,
      name: translationStrings['FunctionalCookies'],
      description: translationStrings['FunctionalCookiesDescriptionShort'],
      toggle: false,
    });
  }

  if (servicesAnalyticalAnonymous.length > 0) {
    serviceGroups.push({
      id: ServiceType.AnalyticalAnonymous,
      services: servicesAnalyticalAnonymous,
      name: translationStrings['AnalyticalAnonymousCookies'],
      description: translationStrings['AnalyticalAnonymousCookiesDescriptionShort'],
      toggle: false,
    });
  }

  if (servicesAnalytical.length > 0) {
    serviceGroups.push({
      id: ServiceType.Analytical,
      services: servicesAnalytical,
      name: translationStrings['AnalyticalCookies'],
      description: translationStrings['AnalyticalCookiesDescriptionShort'],
      toggle: true,
    });
  }

  if (servicesTracking.length > 0) {
    serviceGroups.push({
      id: ServiceType.Tracking,
      services: servicesTracking,
      name: translationStrings['TrackingCookies'],
      description: translationStrings['TrackingCookiesDescriptionShort'],
      toggle: true,
    });
  }

  return serviceGroups;
}
