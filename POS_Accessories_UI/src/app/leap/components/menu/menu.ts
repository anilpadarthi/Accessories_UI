import { Menu } from './menu.model'; 

export const menuItems = [ 
    new Menu (10, 'LEAP_NAV.DASHBOARD', '/', null, 'dashboard', null, false, 0),
    new Menu (20, 'LEAP_NAV.SUPPLIER', '/supplier', null, 'list', null, false, 0),  
    new Menu (20, 'LEAP_NAV.PRODUCTS', '/product', null, 'list', null, false, 0),  
    new Menu (20, 'LEAP_NAV.BULKPRODUCTS', '/bulkproduct', null, 'list', null, false, 0),  
    new Menu (30, 'LEAP_NAV.CATEGORIES', '/category', null, 'category', null, false, 0),  
    new Menu (40, 'LEAP_NAV.SUBCATEGORIES', '/sub-category', null, 'account_tree_outlined', null, false, 0),  
    new Menu (50, 'LEAP_NAV.ORDERS',null , null, 'view_list', null, true, 0),  
    new Menu (60, 'LEAP_NAV.ORDER_LIST', '/order-list', null, 'list_alt', null, false, 50), 
    new Menu (70, 'LEAP_NAV.CREATE_ORDER', '/order-create', null, 'border_outer', "_blank", false, 50), 
    new Menu (80, 'LEAP_NAV.COUPON', '/coupon', null, 'card_giftcard', null, false, 0),  
    new Menu (90, 'LEAP_NAV.CONFIGURATION', '/configuration', null, 'settings', null, false, 0),  
    new Menu (100, 'LEAP_NAV.ACCOUNTABILITY', '/accountability', null, 'assignment', null, false, 0),
    new Menu (110, 'LEAP_NAV.INVENTORY',null , null, 'view_list', null, true, 0), 
    new Menu (120, 'LEAP_NAV.ADDSTOCK', '/stock-inventory', null, 'addstock', null, false, 0),  
    new Menu (130, 'LEAP_NAV.WAREHOUSE', '/warehouse', null, 'warehouse', null, false, 0),  
    new Menu (140, 'LEAP_NAV.THEME', '/admin', null, 'admin', null, false, 0),  
]