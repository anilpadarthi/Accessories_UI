import { menuItems } from './menu'

const allRoles: any[] = [1, 2, 3, 4, 5, 6];
const adminRoles: any[] = [1, 2]

export const userRoles  = {
    'LEAP_NAV.DASHBOARD': allRoles,

    'LEAP_NAV.CATEGORIES': adminRoles,
    'LEAP_NAV.SUBCATEGORIES': adminRoles,
    'LEAP_NAV.PRODUCTS': adminRoles,
    'LEAP_NAV.SUPPLIER': adminRoles,

    'LEAP_NAV.ORDER_LIST': allRoles,
    'LEAP_NAV.CREATE_ORDER': [1, 2, 3, 4, 5],

    'LEAP_NAV.PRODUCTANALYSISREPORT': adminRoles,
    'LEAP_NAV.AGENTANALYSISREPORT': [1, 2, 3, 4],
    'LEAP_NAV.AGENTACCOUNTABILITYREPORT': [1, 2, 3, 4],
    'LEAP_NAV.DASHBOARDREPORT': adminRoles,
    'LEAP_NAV.PERFORMANCEREPORT': [1, 2, 3, 4],

    'LEAP_NAV.COUPON': adminRoles,
    'LEAP_NAV.CONFIGURATION': adminRoles,

    'LEAP_NAV.ADDSTOCK': adminRoles,
    'LEAP_NAV.WAREHOUSE': adminRoles,

    'LEAP_NAV.MAKEPAYMENT': [1, 2, 3, 4],
    'LEAP_NAV.THEME': adminRoles
}