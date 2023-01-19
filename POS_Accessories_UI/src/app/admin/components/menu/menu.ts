import { Menu } from './menu.model'; 

export const menuItems = [ 
    new Menu (10, 'ADMIN_NAV.DASHBOARD', '/admin', null, 'dashboard', null, false, 0),
    new Menu (20, 'ADMIN_NAV.CATEGORIES', '/admin/categories', null, 'category', null, false, 0),  
    new Menu (30, 'ADMIN_NAV.PRODUCTS', null, null, 'grid_on', null, true, 0),   
    new Menu (31, 'ADMIN_NAV.PRODUCT_LIST', '/admin/products/product-list', null, 'list', null, false, 30), 
    new Menu (32, 'ADMIN_NAV.PRODUCT_DETAIL', '/admin/products/product-detail', null, 'remove_red_eye', null, false, 30),  
    new Menu (33, 'ADMIN_NAV.ADD_PRODUCT', '/admin/products/add-product', null, 'add_circle_outline', null, false, 30), 
    new Menu (40, 'ADMIN_NAV.SALES', null, null, 'monetization_on', null, true, 0), 
    new Menu (41, 'ADMIN_NAV.ORDERS', '/admin/sales/orders', null, 'list_alt', null, false, 40), 
    new Menu (42, 'ADMIN_NAV.TRANSACTIONS', '/admin/sales/transactions', null, 'local_atm', null, false, 40),  
    new Menu (50, 'ADMIN_NAV.USERS', '/admin/users', null, 'group_add', null, false, 0),   
    new Menu (60, 'ADMIN_NAV.CUSTOMERS', '/admin/customers', null, 'supervisor_account', null, false, 0),  
    new Menu (70, 'ADMIN_NAV.COUPONS', '/admin/coupons', null, 'card_giftcard', null, false, 0),  
    new Menu (80, 'ADMIN_NAV.WITHDRAWAL', '/admin/withdrawal', null, 'credit_card', null, false, 0), 
    new Menu (90, 'ADMIN_NAV.ANALYTICS', '/admin/analytics', null, 'multiline_chart', null, false, 0), 
    new Menu (100, 'ADMIN_NAV.REFUND', '/admin/refund', null, 'restore', null, false, 0),  
    new Menu (110, 'ADMIN_NAV.FOLLOWERS', '/admin/followers', null, 'follow_the_signs', null, false, 0), 
    new Menu (120, 'ADMIN_NAV.SUPPORT', '/admin/support', null, 'support', null, false, 0), 
    new Menu (130, 'ADMIN_NAV.REVIEWS', '/admin/reviews', null, 'insert_comment', null, false, 0), 
    new Menu (150, 'Level 1', null, null, 'more_horiz', null, true, 0),
    new Menu (151, 'Level 2', null, null, 'folder_open', null, true, 150),
    new Menu (152, 'Level 3', null, null, 'folder_open', null, true, 151),
    new Menu (153, 'Level 4', null, null, 'folder_open', null, true, 152),
    new Menu (154, 'Level 5', null, '/', 'link', null, false, 153),
    new Menu (200, 'ADMIN_NAV.EXTERNAL_LINK', null, 'http://themeseason.com', 'open_in_new', '_blank', false, 0)
]