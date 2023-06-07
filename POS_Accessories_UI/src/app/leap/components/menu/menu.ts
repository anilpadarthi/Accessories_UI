import { Menu } from './menu.model'; 

export const menuItems = [ 
    new Menu (1, 'LEAP_NAV.DASHBOARD', '/', null, 'dashboard', null, false, 0),

    new Menu (2, 'LEAP_NAV.SETUP',null , null, 'view_list', null, true, 0),  
    new Menu (3, 'LEAP_NAV.CATEGORIES', '/category', null, 'category', null, false, 2),  
    new Menu (4, 'LEAP_NAV.SUBCATEGORIES', '/sub-category', null, 'account_tree_outlined', null, false, 2),  
    new Menu (5, 'LEAP_NAV.PRODUCTS', '/product', null, 'list', null, false, 2),
    new Menu (6, 'LEAP_NAV.SUPPLIER', '/supplier', null, 'list', null, false, 2),      
   
    new Menu (10, 'LEAP_NAV.ORDERS',null , null, 'view_list', null, true, 0),  
    new Menu (11, 'LEAP_NAV.ORDER_LIST', '/order-list', null, 'list_alt', null, false, 10), 
    new Menu (12, 'LEAP_NAV.CREATE_ORDER', '/order-create', null, 'border_outer', "_blank", false, 10), 
   
    new Menu (20, 'LEAP_NAV.REPORTS',null , null, 'view_list', null, true, 0),  
    new Menu (21, 'LEAP_NAV.PRODUCTANALYSISREPORT', 'reports/product-analysys', null, 'list_alt', null, false, 20), 
    new Menu (22, 'LEAP_NAV.AGENTANALYSISREPORT', 'reports/agent-analysis', null, 'border_outer', null, false, 20), 
    new Menu (23, 'LEAP_NAV.AGENTACCOUNTABILITYREPORT', '/accountability', null, 'assignment', null, false, 20),
    new Menu (23, 'LEAP_NAV.DASHBOARDREPORT', '/dashboardreport', null, 'assignment', null, false, 20),
    new Menu (23, 'LEAP_NAV.PERFORMANCEREPORT', '/performacereport', null, 'assignment', null, false, 20),

    new Menu (30, 'LEAP_NAV.SETTINGS',null , null, 'view_list', null, true, 0),  
    new Menu (31, 'LEAP_NAV.COUPON', '/coupon', null, 'card_giftcard', null, false, 30),  
    new Menu (32, 'LEAP_NAV.CONFIGURATION', '/configuration', null, 'settings', null, false, 30),  

    new Menu (40, 'LEAP_NAV.INVENTORY',null , null, 'view_list', null, true, 0), 
    new Menu (41, 'LEAP_NAV.ADDSTOCK', '/stock-inventory', null, 'addstock', null, false, 40),  
    new Menu (42, 'LEAP_NAV.WAREHOUSE', '/warehouse', null, 'warehouse', null, false, 40),

    //new Menu (100, 'LEAP_NAV.MAKEPAYMENT', '/accountability/makepayment', null, 'assignment', null, false, 0),
    //new Menu (101, 'LEAP_NAV.THEME', '/admin', null, 'admin', null, false, 0),  
]